import { useRef } from 'react'
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber'
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
function Initials() {
  const group = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!group.current || prefersReducedMotion) return
    group.current.rotation.y += delta * 0.6
    group.current.rotation.x = Math.sin(performance.now() / 2000) * 0.25
  })

  return (
    <group ref={group} position={[2.6, 0.6, 0]}>
      <VoxelLetter glyph={GLYPHS.D} color={COLORS[0]} position={[-0.7, 0.2, 0.25]} />
      <VoxelLetter glyph={GLYPHS.H} color={COLORS[2]} position={[0.7, -0.2, -0.25]} />
    </group>
  )
}

interface GemProps {
  position: [number, number, number]
  size: number
  color: string
  spin: number
  floatSpeed: number
  tilt: number
}

const GEM_COUNT = 8
const random = (min: number, max: number) => min + Math.random() * (max - min)

/** Scatter gems across the scene, re-rolled on every page load. Keeps clear of the initials. */
function makeGems(): GemProps[] {
  const gems: GemProps[] = []
  while (gems.length < GEM_COUNT) {
    const position: [number, number, number] = [random(-6, 6.5), random(-0.6, 3.4), random(-7, -0.5)]
    const nearInitials = Math.abs(position[0] - 2.6) < 2 && Math.abs(position[1] - 0.6) < 1.6 && position[2] > -3
    const nearOtherGem = gems.some((g) => Math.hypot(...g.position.map((v, i) => v - position[i])) < 1.6)
    if (nearInitials || nearOtherGem) continue
    gems.push({
      position,
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

function Gem({ position, size, color, spin, floatSpeed, tilt }: GemProps) {
  const mesh = useRef<THREE.Mesh>(null)

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
