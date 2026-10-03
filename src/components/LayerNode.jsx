import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { PALETTE, GPU_SPLIT_LAYERS } from '../lib/architecture'

/**
 * A small greyscale texture of blobby "activations", multiplied over the layer
 * colour. Purely decorative: it keeps a close-up block from reading as a flat
 * wall, and is shared by every layer so it costs one texture.
 */
function makeActivationTexture() {
  const N = 64
  const data = new Uint8Array(N * N * 4)
  const blobs = Array.from({ length: 16 }, (_, i) => ({
    x: ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1,
    y: ((Math.sin(i * 78.233) * 43758.5453) % 1 + 1) % 1,
    r: 0.04 + (((Math.sin(i * 39.77) * 43758.5453) % 1 + 1) % 1) * 0.09,
  }))
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const u = x / N
      const v = y / N
      let a = 0
      for (const b of blobs) {
        const d = (u - b.x) ** 2 + (v - b.y) ** 2
        a += Math.exp(-d / b.r)
      }
      const val = Math.min(1, 0.45 + a * 0.55)
      const i = (y * N + x) * 4
      data[i] = data[i + 1] = data[i + 2] = Math.round(val * 255)
      data[i + 3] = 255
    }
  }
  const tex = new THREE.DataTexture(data, N, N, THREE.RGBAFormat)
  tex.needsUpdate = true
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.LinearFilter
  return tex
}

const ACTIVATION_TEX = makeActivationTexture()

/**
 * One stage of the architecture.
 *  - conv / pool / input -> a stack of translucent feature-map planes
 *  - dense / output      -> a compact column of neuron nodes
 * Active layers glow; inactive ones dim so the eye follows the tour.
 */
export default function LayerNode({ layer, active, dimmed, showGpuLanes, reduced, onSelect }) {
  const group = useRef()
  const color = PALETTE[layer.kind]
  const isStack = layer.kind === 'conv' || layer.kind === 'pool' || layer.kind === 'input'
  // Softmax is a fixed function, so it gets a solid processing block — visually
  // unlike the neuron columns used for the learned dense layers.
  const isFunction = layer.kind === 'function'
  // The final result is a probability distribution, drawn as small bars.
  const isResult = layer.kind === 'output'
  const splitGpu = showGpuLanes && GPU_SPLIT_LAYERS.has(layer.id)

  const opacity = dimmed ? 0.12 : active ? 0.5 : 0.3
  const emissive = dimmed ? 0.06 : active ? 0.75 : 0.22

  // Plane offsets along z so the stack reads as depth (channel count).
  const offsets = useMemo(() => {
    const n = layer.planes ?? 1
    const step = layer.depth / Math.max(1, n - 1 || 1)
    return Array.from({ length: n }, (_, i) => (n === 1 ? 0 : -layer.depth / 2 + i * step))
  }, [layer.planes, layer.depth])

  const nodes = useMemo(() => {
    const n = layer.nodes ?? 0
    const h = layer.size[1]
    return Array.from({ length: n }, (_, i) => -h / 2 + (h / (n - 1 || 1)) * i)
  }, [layer.nodes, layer.size])

  // Illustrative probability bars for the final result block: one long bar and
  // a falling tail, echoing the softmax chart in the step-7 panel.
  const bars = useMemo(() => {
    const n = layer.bars ?? 0
    if (!n) return []
    const vals = [1, 0.34, 0.2, 0.13, 0.09, 0.06, 0.04]
    const h = layer.size[1]
    return Array.from({ length: n }, (_, i) => ({
      y: h / 2 - (h / n) * (i + 0.5),
      w: (vals[i] ?? 0.04) * layer.size[0],
    }))
  }, [layer.bars, layer.size])

  useFrame((state) => {
    if (!group.current) return
    if (reduced) {
      group.current.position.y = 0
      return
    }
    // Barely-there float; keeps the model feeling alive without distracting.
    const t = state.clock.elapsedTime
    group.current.position.y = active ? Math.sin(t * 1.1 + layer.x) * 0.055 : 0
  })

  const handle = (e) => {
    e.stopPropagation()
    onSelect?.(layer.id)
  }

  return (
    <group ref={group} position={[layer.x, 0, 0]}>
      {isStack &&
        offsets.map((z, i) => (
          <mesh key={i} position={[0, 0, z]} onClick={handle}>
            <planeGeometry args={layer.size} />
            <meshStandardMaterial
              color={color}
              map={ACTIVATION_TEX}
              transparent
              opacity={opacity}
              emissive={new THREE.Color(color)}
              emissiveIntensity={emissive}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        ))}

      {/* Wireframe cage: gives the stack a readable silhouette from any angle. */}
      {isStack && (
        <mesh onClick={handle}>
          <boxGeometry args={[layer.size[0], layer.size[1], layer.depth]} />
          <meshBasicMaterial
            color={color}
            wireframe
            transparent
            opacity={dimmed ? 0.1 : active ? 0.5 : 0.22}
          />
        </mesh>
      )}

      {layer.kind === 'dense' &&
        nodes.map((y, i) => (
          <mesh key={i} position={[0, y, 0]} onClick={handle}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial
              color={color}
              emissive={new THREE.Color(color)}
              emissiveIntensity={dimmed ? 0.15 : active ? 1.5 : 0.6}
              transparent
              opacity={dimmed ? 0.3 : 0.95}
            />
          </mesh>
        ))}

      {/* Softmax: a solid block with a function glyph — no neurons, because
          nothing here is learned. */}
      {isFunction && (
        <group onClick={handle}>
          <mesh>
            <boxGeometry args={[layer.size[0], layer.size[1], layer.depth]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={dimmed ? 0.14 : active ? 0.42 : 0.26}
              emissive={new THREE.Color(color)}
              emissiveIntensity={dimmed ? 0.05 : active ? 0.4 : 0.15}
              depthWrite={false}
            />
          </mesh>
          <mesh>
            <boxGeometry args={[layer.size[0], layer.size[1], layer.depth]} />
            <meshBasicMaterial
              color={color}
              wireframe
              transparent
              opacity={dimmed ? 0.12 : active ? 0.65 : 0.3}
            />
          </mesh>
          {!dimmed && (
            <Html position={[0, 0, layer.depth / 2 + 0.05]} center distanceFactor={16} pointerEvents="none">
              <div className={`fn-glyph ${active ? 'is-active' : ''}`}>σ</div>
            </Html>
          )}
        </group>
      )}

      {/* Final result: a small probability distribution, not neurons. */}
      {isResult &&
        bars.map((b, i) => (
          <mesh key={i} position={[-layer.size[0] / 2 + b.w / 2, b.y, 0]} onClick={handle}>
            <boxGeometry args={[b.w, layer.size[1] / (bars.length * 1.7), layer.depth]} />
            <meshStandardMaterial
              color={color}
              emissive={new THREE.Color(color)}
              emissiveIntensity={dimmed ? 0.12 : active ? 1.1 : 0.45}
              transparent
              opacity={dimmed ? 0.25 : 0.92}
            />
          </mesh>
        ))}

      {/* GPU lanes: historical context, deliberately understated. */}
      {splitGpu && !dimmed && (
        <>
          <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
            <planeGeometry args={[layer.size[0] * 1.04, 0.012]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
          </mesh>
        </>
      )}

      {!dimmed && (
        <Html
          position={[0, -layer.size[1] / 2 - 0.85 - (layer.labelDrop ?? 0), 0]}
          center
          distanceFactor={18}
          zIndexRange={[20, 0]}
          pointerEvents="none"
        >
          <div
            className={`layer-tag ${active ? 'is-active' : ''} ${
              isFunction ? 'layer-tag--fn' : ''
            }`}
          >
            <span className="layer-tag__name">{layer.label}</span>
            <span className="layer-tag__dims">{layer.dims}</span>
            {isFunction && <span className="layer-tag__note">not a learned layer</span>}
          </div>
        </Html>
      )}
    </group>
  )
}
