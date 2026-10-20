import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars } from '@react-three/drei'
import * as THREE from 'three'

const COLORS = ['#e4002b', '#00a651', '#2e5bd8', '#ffc20e']

const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** n64 logo but not the actual one */
function BlockCluster() {
  const group = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!group.current || prefersReducedMotion) return
    group.current.rotation.y += delta * 0.6
    group.current.rotation.x = Math.sin(performance.now() / 2000) * 0.25
  })

  return (
    <group ref={group} position={[2.6, 0.6, 0]}>
      {COLORS.map((color, i) => {
        const angle = (i / COLORS.length) * Math.PI * 2
        return (
          <mesh key={color} position={[Math.cos(angle) * 0.75, i % 2 ? 0.35 : -0.35, Math.sin(angle) * 0.75]}>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshLambertMaterial color={color} flatShading />
          </mesh>
        )
      })}
    </group>
  )
}

function Gem() {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (mesh.current && !prefersReducedMotion) mesh.current.rotation.y -= delta * 1.2
  })

  return (
    <Float speed={prefersReducedMotion ? 0 : 2} floatIntensity={1.2} rotationIntensity={0}>
      <mesh ref={mesh} position={[4.8, 2.6, -2.5]}>
        <octahedronGeometry args={[0.55, 0]} />
        <meshLambertMaterial color="#ffc20e" emissive="#7a4a00" flatShading />
      </mesh>
    </Float>
  )
}

/** Checkerboard background scrolling */
function Ground() {
  useFrame((_, delta) => {
    if (!prefersReducedMotion) checker.offset.y += delta * 0.4
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]}>
      <planeGeometry args={[60, 60]} />
      <meshLambertMaterial map={checker} />
    </mesh>
  )
}

function makeCheckerTexture() {
  const size = 2
  const data = new Uint8Array([
    46, 91, 216, 255, 20, 21, 74, 255,
    20, 21, 74, 255, 46, 91, 216, 255,
  ])
  const texture = new THREE.DataTexture(data, size, size)
  texture.magFilter = THREE.NearestFilter
  texture.minFilter = THREE.NearestFilter
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(30, 30)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

const checker = makeCheckerTexture()

export function Scene() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <Canvas
        className="pixelated"
        dpr={0.4}
        camera={{ position: [0, 0.8, 7], fov: 55 }}
        gl={{ antialias: false }}
      >
        <color attach="background" args={['#0b0b2a']} />
        <fog attach="fog" args={['#0b0b2a', 6, 22]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 4]} intensity={2.2} />
        <Stars radius={40} depth={20} count={800} factor={3} fade speed={prefersReducedMotion ? 0 : 0.5} />
        <BlockCluster />
        <Gem />
        <Ground />
      </Canvas>
    </div>
  )
}
