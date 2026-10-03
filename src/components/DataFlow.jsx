import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { LAYERS } from '../lib/architecture'

const COUNT = 220
const X_START = LAYERS[0].x
const X_END = LAYERS[LAYERS.length - 1].x
const SPAN = X_END - X_START

/**
 * Glowing pulses travelling left-to-right to suggest information flow.
 * One Points object (one draw call) rather than many meshes.
 */
export default function DataFlow({ reduced, active }) {
  const points = useRef()

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const seeds = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      seeds[i * 3] = Math.random() // phase along the model
      seeds[i * 3 + 1] = (Math.random() - 0.5) * 2 // lateral spread
      seeds[i * 3 + 2] = 0.6 + Math.random() * 0.8 // speed
    }
    return { positions, seeds }
  }, [])

  useFrame((state, delta) => {
    if (!points.current || reduced) return
    const arr = points.current.geometry.attributes.position.array
    const t = state.clock.elapsedTime
    for (let i = 0; i < COUNT; i++) {
      let phase = (seeds[i * 3] + t * 0.055 * seeds[i * 3 + 2]) % 1
      const x = X_START + phase * SPAN
      // Funnel the stream inward as the tensor shrinks toward the classifier.
      const taper = 1 - phase * 0.72
      arr[i * 3] = x
      arr[i * 3 + 1] = seeds[i * 3 + 1] * 2.1 * taper + Math.sin(t * 1.4 + i) * 0.06
      arr[i * 3 + 2] = Math.cos(t * 0.9 + i * 1.7) * 1.1 * taper
    }
    points.current.geometry.attributes.position.needsUpdate = true
  })

  // With reduced motion we still show the stream, just static.
  useMemo(() => {
    if (!reduced) return
    for (let i = 0; i < COUNT; i++) {
      const phase = seeds[i * 3]
      const taper = 1 - phase * 0.72
      positions[i * 3] = X_START + phase * SPAN
      positions[i * 3 + 1] = seeds[i * 3 + 1] * 2.1 * taper
      positions[i * 3 + 2] = Math.cos(i * 1.7) * 1.1 * taper
    }
  }, [reduced, positions, seeds])

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.11}
        color="#9fd8ff"
        transparent
        opacity={active ? 0.75 : 0.35}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
