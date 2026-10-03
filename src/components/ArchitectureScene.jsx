import { useMemo, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import { LAYERS, TOUR, layoutFor, cameraFor } from '../lib/architecture'
import LayerNode from './LayerNode'
import CameraTour from './CameraTour'
import DataFlow from './DataFlow'

/** Two faint lanes behind the conv stack: the original two-GPU split. */
function GpuLanes({ visible }) {
  if (!visible) return null
  const x0 = -21.5
  const x1 = 10.6
  const mid = (x0 + x1) / 2
  const width = x1 - x0
  return (
    <group position={[mid, 0, -3.4]}>
      {[1.9, -1.9].map((y, i) => (
        <group key={i} position={[0, y, 0]}>
          <mesh>
            <planeGeometry args={[width, 0.02]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.16} />
          </mesh>
          <Html position={[-width / 2 - 1.4, 0, 0]} center distanceFactor={26} pointerEvents="none">
            <div className="gpu-lane-label">GPU {i === 0 ? 1 : 2}</div>
          </Html>
        </group>
      ))}
    </group>
  )
}

/**
 * Link between two stages. Connections that touch the softmax block are drawn
 * as a dotted trail rather than a solid rod: nothing is learned there, values
 * just pass through a function.
 */
function Connector({ from, to, dimmed, dotted }) {
  const mid = (from + to) / 2
  const len = Math.max(0.05, to - from)

  if (dotted) {
    const n = Math.max(2, Math.round(len / 0.38))
    return (
      <group>
        {Array.from({ length: n }, (_, i) => (
          <mesh key={i} position={[from + (len / (n - 1 || 1)) * i, 0, 0]}>
            <sphereGeometry args={[0.055, 8, 8]} />
            <meshBasicMaterial color="#9fb0c6" transparent opacity={dimmed ? 0.08 : 0.5} />
          </mesh>
        ))}
      </group>
    )
  }

  return (
    <mesh position={[mid, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.014, 0.014, len, 6]} />
      <meshBasicMaterial color="#7fb2e0" transparent opacity={dimmed ? 0.07 : 0.28} />
    </mesh>
  )
}

export default function ArchitectureScene({
  stepIndex,
  reduced,
  onSelectLayer,
  flightKey,
  depthMode = 'schematic',
}) {
  const controls = useRef()
  const step = TOUR[stepIndex]

  // Layer geometry for the active depth mode.
  const layout = useMemo(() => layoutFor(depthMode), [depthMode])
  const stepCamera = useMemo(
    () => cameraFor(step, depthMode, layout),
    [step, depthMode, layout]
  )

  const focus = useMemo(() => (step.focus ? new Set(step.focus) : null), [step])
  const connectors = useMemo(() => {
    const pairs = []
    for (let i = 0; i < layout.length - 1; i++) {
      const a = layout[i]
      const b = layout[i + 1]
      pairs.push({
        key: `${a.id}-${b.id}`,
        from: a.x + a.depth / 2,
        to: b.x - b.depth / 2,
        ids: [a.id, b.id],
        dotted: a.kind === 'function' || b.kind === 'function',
      })
    }
    return pairs
  }, [layout])

  return (
    <Canvas
      camera={{ position: TOUR[0].camera.position, fov: 42, near: 0.1, far: 300 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onPointerMissed={() => onSelectLayer?.(null)}
    >
      <color attach="background" args={['#070a12']} />
      <fog attach="fog" args={['#070a12', 48, 130]} />

      <ambientLight intensity={0.45} />
      <directionalLight position={[8, 14, 16]} intensity={0.7} />
      <pointLight position={[-24, 4, 10]} intensity={26} distance={40} color="#4ea8ff" />
      <pointLight position={[20, 3, 10]} intensity={22} distance={36} color="#b57bff" />

      <GpuLanes visible={Boolean(step.showGpuLanes)} />
      <DataFlow reduced={reduced} active={!focus} />

      {connectors.map((c) => (
        <Connector
          key={c.key}
          from={c.from}
          to={c.to}
          dotted={c.dotted}
          dimmed={focus ? !c.ids.every((id) => focus.has(id)) : false}
        />
      ))}

      {layout.map((layer) => (
        <LayerNode
          key={layer.id}
          layer={layer}
          active={focus ? focus.has(layer.id) : false}
          dimmed={focus ? !focus.has(layer.id) : false}
          showGpuLanes={Boolean(step.showGpuLanes)}
          reduced={reduced}
          onSelect={onSelectLayer}
        />
      ))}

      <CameraTour
        step={step}
        camera={stepCamera}
        controlsRef={controls}
        reduced={reduced}
        flightKey={flightKey}
        depthMode={depthMode}
      />

      <OrbitControls
        ref={controls}
        enablePan
        enableZoom
        enableDamping
        dampingFactor={0.08}
        minDistance={2.5}
        maxDistance={depthMode === 'schematic' ? 120 : 200}
        maxPolarAngle={Math.PI * 0.86}
        /* Zoom toward the pointer, not the tour's fixed target. Without this,
           scrolling at the far ends of the model just flies past them, because
           the orbit target stays pinned near the centre. */
        zoomToCursor
        /* Pan parallel to the screen so dragging at the outer layers feels
           natural instead of swinging around the middle. */
        screenSpacePanning
        makeDefault
      />
    </Canvas>
  )
}
