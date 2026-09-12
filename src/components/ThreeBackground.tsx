import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Draws the leaf silhouette + veins into a canvas texture. A flat vector fill
// reads as a plain blob at small on-screen sizes; a rasterized midrib and
// side veins are what make it legible as an actual leaf instead of a stain.
function createLeafTexture(): THREE.CanvasTexture {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const cx = size / 2
  const cy = size / 2
  const s = size * 0.46

  ctx.translate(cx, cy)
  ctx.beginPath()
  ctx.moveTo(0, -s)
  ctx.bezierCurveTo(s * 0.55, -s * 0.55, s * 0.62, s * 0.25, s * 0.15, s * 0.85)
  ctx.bezierCurveTo(s * 0.08, s * 0.95, -s * 0.08, s * 0.95, -s * 0.15, s * 0.85)
  ctx.bezierCurveTo(-s * 0.62, s * 0.25, -s * 0.55, -s * 0.55, 0, -s)
  ctx.closePath()

  ctx.save()
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.clip()

  ctx.strokeStyle = 'rgba(0,0,0,0.32)'
  ctx.lineWidth = s * 0.045
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(0, -s * 0.95)
  ctx.lineTo(0, s * 0.88)
  ctx.stroke()

  ctx.strokeStyle = 'rgba(0,0,0,0.2)'
  ctx.lineWidth = s * 0.028
  for (const t of [-0.55, -0.2, 0.15, 0.5]) {
    const y = -s * 0.7 + t * s * 1.3
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(s * 0.34, y - s * 0.12)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(-s * 0.34, y - s * 0.12)
    ctx.stroke()
  }
  ctx.restore()

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

const PALETTE = [0xC4714A, 0x6B7645, 0xE8D5C0, 0xA85A35, 0x8A9660, 0xD4896A, 0x505930]
const PARTICLE_COUNT = 80
const GRAVITY = 0.0016
// The footer acts as "ground": at most this many leaves pile up there, and
// only while the footer is actually on screen — scroll away and the pile
// releases instead of accumulating forever.
const MAX_SETTLED_ON_FOOTER = 16
const FOOTER_GUST_INTERVAL = 7 // seconds between automatic wind gusts

type LeafMode = 'falling' | 'settled' | 'scattered'

interface LeafState {
  mode: LeafMode
  driftSpeed: number
  rotationSpeed: number
  wobblePhase: number
  wobbleAmp: number
  vx: number
  vy: number
  restOffset: number
}

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const footerEl = document.querySelector('footer')

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      200,
    )
    camera.position.z = 50

    const getViewport = () => {
      const vFOV = (camera.fov * Math.PI) / 180
      const h = 2 * Math.tan(vFOV / 2) * camera.position.z
      return { w: h * camera.aspect, h }
    }

    // Converts a viewport-relative pixel Y (0 = top of screen) into the
    // matching Y in Three.js world units, given the current world height.
    const screenYToWorldY = (screenY: number, worldHeight: number) => {
      const fraction = screenY / window.innerHeight
      return worldHeight / 2 - fraction * worldHeight
    }

    const leafTexture = createLeafTexture()
    const leafGeometry = new THREE.PlaneGeometry(1, 1)
    const leafMaterials: THREE.MeshBasicMaterial[] = []
    const particles: THREE.Mesh[] = []

    const { w: vw, h: vh } = getViewport()

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const material = new THREE.MeshBasicMaterial({
        map: leafTexture,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.1,
        opacity: 0.55 + Math.random() * 0.4,
      })
      leafMaterials.push(material)
      const mesh = new THREE.Mesh(leafGeometry, material)
      const scale = 0.3 + Math.random() * 0.7
      mesh.scale.setScalar(scale)
      mesh.position.set(
        (Math.random() - 0.5) * vw,
        (Math.random() - 0.5) * vh,
        (Math.random() - 0.5) * 15,
      )
      mesh.rotation.z = Math.random() * Math.PI * 2
      const state: LeafState = {
        mode: 'falling',
        driftSpeed: 0.012 + Math.random() * 0.022,
        rotationSpeed: (Math.random() - 0.5) * 0.018,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleAmp: 0.004 + Math.random() * 0.009,
        vx: 0,
        vy: 0,
        restOffset: Math.random() * 0.4,
      }
      mesh.userData = state
      scene.add(mesh)
      particles.push(mesh)
    }

    let animId: number
    let time = 0
    let gustTimer = 0

    const animate = () => {
      animId = requestAnimationFrame(animate)
      time += 0.016
      const { w, h } = getViewport()

      // The "floor" only exists while the footer is on screen — it sits at
      // the footer's own bottom edge (or the viewport bottom, whichever is
      // higher up), so leaves pile on the footer itself, never in the blank
      // space past the end of the page.
      let footerVisible = false
      let floorWorldY = -h / 2 - 999
      if (footerEl) {
        const rect = footerEl.getBoundingClientRect()
        footerVisible = rect.top < window.innerHeight && rect.bottom > 0
        if (footerVisible) {
          const floorScreenY = Math.min(window.innerHeight, rect.bottom)
          floorWorldY = screenYToWorldY(floorScreenY, h)
        }
      }

      if (footerVisible) {
        gustTimer += 0.016
      } else {
        gustTimer = 0
      }

      let settledCount = 0
      for (const p of particles) {
        if ((p.userData as LeafState).mode === 'settled') settledCount++
      }

      // Periodic gust: blow the whole pile back into the air, then it drifts
      // back down and settles again.
      if (footerVisible && settledCount > 0 && gustTimer >= FOOTER_GUST_INTERVAL) {
        gustTimer = 0
        for (const p of particles) {
          const ud = p.userData as LeafState
          if (ud.mode !== 'settled') continue
          ud.mode = 'scattered'
          ud.vy = -(0.2 + Math.random() * 0.3)
          ud.vx = (Math.random() - 0.5) * 0.9
          ud.rotationSpeed = (Math.random() - 0.5) * 0.05
        }
      }

      for (const p of particles) {
        const ud = p.userData as LeafState

        if (ud.mode === 'falling') {
          p.position.y -= ud.driftSpeed
          p.position.x += Math.sin(time * 0.4 + ud.wobblePhase) * ud.wobbleAmp
          p.rotation.z += ud.rotationSpeed

          if (p.position.x > w / 2 + 2 || p.position.x < -w / 2 - 2) {
            p.position.x = (Math.random() - 0.5) * w
          }

          if (
            footerVisible &&
            settledCount < MAX_SETTLED_ON_FOOTER &&
            p.position.y <= floorWorldY + ud.restOffset
          ) {
            p.position.y = floorWorldY + ud.restOffset
            ud.mode = 'settled'
            settledCount++
          } else if (p.position.y < -h / 2 - 2) {
            p.position.y = h / 2 + 2
            p.position.x = (Math.random() - 0.5) * w
          }
        } else if (ud.mode === 'settled') {
          // The floor only exists while looking at the footer — scroll away
          // and the pile releases instead of staying stuck forever.
          if (!footerVisible) ud.mode = 'falling'
        } else if (ud.mode === 'scattered') {
          ud.vy += GRAVITY
          p.position.y += ud.vy
          p.position.x += ud.vx
          ud.vx *= 0.985
          p.rotation.z += ud.rotationSpeed

          if (footerVisible && p.position.y <= floorWorldY + ud.restOffset && ud.vy >= 0) {
            p.position.y = floorWorldY + ud.restOffset
            ud.mode = 'settled'
            ud.vx = 0
            ud.vy = 0
          } else if (p.position.y < -h / 2 - 2) {
            p.position.y = h / 2 + 2
            p.position.x = (Math.random() - 0.5) * w
            ud.mode = 'falling'
            ud.vx = 0
            ud.vy = 0
          }
        }
      }

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    return () => {
      cancelAnimationFrame(animId)
      resizeObserver.disconnect()
      leafGeometry.dispose()
      leafTexture.dispose()
      leafMaterials.forEach(m => m.dispose())
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-[5] pointer-events-none"
    />
  )
}
