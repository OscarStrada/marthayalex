import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function createLeafShape(): THREE.Shape {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0.5)
  shape.bezierCurveTo(0.22, 0.38, 0.28, 0.12, 0.28, 0)
  shape.bezierCurveTo(0.28, -0.22, 0.14, -0.44, 0, -0.5)
  shape.bezierCurveTo(-0.14, -0.44, -0.28, -0.22, -0.28, 0)
  shape.bezierCurveTo(-0.28, 0.12, -0.22, 0.38, 0, 0.5)
  return shape
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

    const leafShape = createLeafShape()
    const leafGeometry = new THREE.ShapeGeometry(leafShape, 10)
    const particles: THREE.Mesh[] = []

    const { w: vw, h: vh } = getViewport()

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35 + Math.random() * 0.5,
      })
      const mesh = new THREE.Mesh(leafGeometry, material)
      const scale = 0.25 + Math.random() * 0.65
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
      particles.forEach(p => (p.material as THREE.MeshBasicMaterial).dispose())
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={mountRef} className="absolute inset-0 z-0" />
}
