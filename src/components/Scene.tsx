import { useRef } from 'react'
import { Canvas, useFrame, useThree, type ThreeElements } from '@react-three/fiber'
import { Float, Stars } from '@react-three/drei'
import * as THREE from 'three'

const COLORS = ['#e4002b', '#00a651', '#2e5bd8', '#ffc20e']

const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** 5x5 pixel-font glyphs, top row first */
const GLYPHS = {
  D: ['####.', '#...#', '#...#', '#...#', '####.'],
  H: ['#...#', '#...#', '#####', '#...#', '#...#'],
}

const VOXEL = 0.24
const voxelGeometry = new THREE.BoxGeometry(VOXEL, VOXEL, VOXEL * 2)

function VoxelLetter({ glyph, color, ...props }: { glyph: string[]; color: string } & ThreeElements['group']) {
  const offset = (glyph.length - 1) / 2
  return (
    <group {...props}>
      {glyph.flatMap((row, y) =>
        [...row].map((cell, x) =>
          cell === '#' ? (
            <mesh key={`${x}-${y}`} geometry={voxelGeometry} position={[(x - offset) * VOXEL, (offset - y) * VOXEL, 0]}>
              <meshLambertMaterial color={color} flatShading />
            </mesh>
          ) : null,
        ),
      )}
    </group>
  )
}

/** Initials built from blocks, in the spirit of the n64 logo */
const INITIALS_SPAN = 2.8

function Initials() {
  const group = useRef<THREE.Group>(null)
  const { viewport, camera } = useThree()

  useFrame((_, delta) => {
    if (!group.current || prefersReducedMotion) return
    group.current.rotation.y += delta * 0.6
    group.current.rotation.x = Math.sin(performance.now() / 2000) * 0.25
  })

  const portrait = viewport.aspect < 1
  const scale = portrait ? Math.min(1, (viewport.width * 0.55) / INITIALS_SPAN) : 1
  const top = camera.position.y + viewport.height / 2
  const position: [number, number, number] = portrait ? [0, top - 1.4 * scale - 0.5, 0] : [2.6, 0.6, 0]

  return (
    <group position={position} scale={scale}>
      <group ref={group}>
        <VoxelLetter glyph={GLYPHS.D} color={COLORS[0]} position={[-0.7, 0.2, 0.25]} />
        <VoxelLetter glyph={GLYPHS.H} color={COLORS[2]} position={[0.7, -0.2, -0.25]} />
      </group>
    </group>
  )
}

interface GemProps {
  x: number
  y: number
  z: number
  size: number
  color: string
  spin: number
  floatSpeed: number
  tilt: number
}

const GEM_COUNT = 8
const random = (min: number, max: number) => min + Math.random() * (max - min)

/**
 * Scatter gems across the scene, re-rolled on every page load. Positions are relative to
 * the visible area so they fill phones and wide screens alike. They sit behind the initials.
 */
function makeGems(): GemProps[] {
  const gems: GemProps[] = []
  for (let attempt = 0; gems.length < GEM_COUNT && attempt < 500; attempt++) {
    const x = random(-0.9, 0.9)
    const y = random(0, 1)
    if (gems.some((g) => Math.hypot(g.x - x, (g.y - y) * 2) < 0.4)) continue
    gems.push({
      x,
      y,
      z: random(-7, -1.5),
      size: random(0.25, 0.55),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      spin: random(0.6, 1.6) * (Math.random() < 0.5 ? -1 : 1),
      floatSpeed: random(1.2, 2.6),
      tilt: random(-0.4, 0.4),
    })
  }
  return gems
}

const gems = makeGems()

function Gem({ x, y, z, size, color, spin, floatSpeed, tilt }: GemProps) {
  const mesh = useRef<THREE.Mesh>(null)
  const { viewport, camera } = useThree()
  const visible = viewport.getCurrentViewport(camera, [0, 0, z])
  const top = camera.position.y + visible.height / 2 - 0.6
  const position: [number, number, number] = [
    x * (visible.width / 2 - 0.4),
    THREE.MathUtils.lerp(-0.6, top, y),
    z,
  ]

  useFrame((_, delta) => {
    if (mesh.current && !prefersReducedMotion) mesh.current.rotation.y += delta * spin
  })

  return (
    <Float speed={prefersReducedMotion ? 0 : floatSpeed} floatIntensity={1.2} rotationIntensity={0}>
      <mesh ref={mesh} position={position} rotation={[0, 0, tilt]}>
        <octahedronGeometry args={[size, 0]} />
        <meshLambertMaterial color={color} emissive={color} emissiveIntensity={0.25} flatShading />
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
        <Initials />
        {gems.map((gem, i) => (
          <Gem key={i} {...gem} />
        ))}
        <Ground />
      </Canvas>
    </div>
  )
}
