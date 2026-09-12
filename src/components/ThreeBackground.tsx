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

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

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
      mesh.userData = {
        driftSpeed: 0.012 + Math.random() * 0.022,
        rotationSpeed: (Math.random() - 0.5) * 0.018,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleAmp: 0.004 + Math.random() * 0.009,
      }
      scene.add(mesh)
      particles.push(mesh)
    }

    let animId: number
    let time = 0

    const animate = () => {
      animId = requestAnimationFrame(animate)
      time += 0.016
      const { w, h } = getViewport()

      for (const p of particles) {
        const ud = p.userData as {
          driftSpeed: number
          rotationSpeed: number
          wobblePhase: number
          wobbleAmp: number
        }
        p.position.y -= ud.driftSpeed
        p.position.x += Math.sin(time * 0.4 + ud.wobblePhase) * ud.wobbleAmp
        p.rotation.z += ud.rotationSpeed

        if (p.position.y < -h / 2 - 2) {
          p.position.y = h / 2 + 2
          p.position.x = (Math.random() - 0.5) * w
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
      className="fixed inset-0 z-0 pointer-events-none"
    />
  )
}
