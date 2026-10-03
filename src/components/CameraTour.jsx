import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/** Ease-in-out; makes the flights feel like a camera, not a lerp. */
function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/**
 * Flies the camera to each tour step's framing.
 *
 * Drives the OrbitControls target as well as the camera position, so manual
 * orbiting stays natural after a flight lands. While a flight is in progress
 * controls are disabled; they re-enable on arrival.
 */
/**
 * Distance needed to fit a world-space width, given the camera's vertical FOV
 * and the current viewport aspect. Keeps the overview fully framed on a 16:9
 * laptop and a 4:3 projector alike, instead of hardcoding one distance.
 */
function fitDistance(camera, width, aspect, margin = 1.14) {
  const vFov = (camera.fov * Math.PI) / 180
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect)
  return (width * margin) / 2 / Math.tan(hFov / 2)
}

export default function CameraTour({ step, camera: framing, controlsRef, reduced, flightKey, depthMode }) {
  const { camera, size } = useThree()
  const anim = useRef(null)

  // Debug hook: lets the end-to-end tour test assert that the camera moved.
  useEffect(() => {
    if (import.meta.env.DEV) {
      window.__cam = camera
      window.__THREE = THREE
    }
  }, [camera])

  useEffect(() => {
    const view = framing ?? step.camera
    const toTarget = new THREE.Vector3(...view.target)
    const to = new THREE.Vector3(...view.position)

    // Steps that must frame a known width (the overview, the deep-stack shot)
    // solve for z rather than trusting a hardcoded distance.
    if (view.fitWidth) {
      const aspect = size.width / Math.max(1, size.height)
      const d = fitDistance(camera, view.fitWidth, aspect)
      to.setZ(Math.max(d, view.minZ ?? 0))
    }

    if (reduced) {
      // No motion: cut straight to the framing.
      camera.position.copy(to)
      if (controlsRef.current) {
        controlsRef.current.target.copy(toTarget)
        controlsRef.current.update()
      }
      anim.current = null
      return
    }

    const fromTarget = controlsRef.current
      ? controlsRef.current.target.clone()
      : new THREE.Vector3()

    const from = camera.position.clone()
    const dist = from.distanceTo(to) + fromTarget.distanceTo(toTarget)
    // Longer moves get more time, but clamped so the tour never drags.
    const duration = THREE.MathUtils.clamp(0.75 + dist * 0.035, 0.9, 2.1)

    anim.current = { from, to, fromTarget, toTarget, t: 0, duration }
    if (controlsRef.current) controlsRef.current.enabled = false
  }, [step, framing, depthMode, reduced, camera, controlsRef, flightKey, size.width, size.height])

  useFrame((_, delta) => {
    const a = anim.current
    if (!a) return

    a.t = Math.min(1, a.t + delta / a.duration)
    const k = easeInOut(a.t)

    camera.position.lerpVectors(a.from, a.to, k)
    if (controlsRef.current) {
      controlsRef.current.target.lerpVectors(a.fromTarget, a.toTarget, k)
      controlsRef.current.update()
    }
    camera.lookAt(controlsRef.current ? controlsRef.current.target : a.toTarget)

    if (a.t >= 1) {
      anim.current = null
      if (controlsRef.current) controlsRef.current.enabled = true
    }
  })

  return null
}
