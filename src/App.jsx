import { useCallback, useEffect, useState } from 'react'
import ArchitectureScene from './components/ArchitectureScene'
import TourControls from './components/TourControls'
import InputImageDemo from './components/InputImageDemo'
import FilterConvolutionDemo from './components/FilterConvolutionDemo'
import FeatureMapDemo from './components/FeatureMapDemo'
import PoolingDemo from './components/PoolingDemo'
import DeepLayersDemo from './components/DeepLayersDemo'
import DenseLayerDemo from './components/DenseLayerDemo'
import SoftmaxOutput from './components/SoftmaxOutput'
import { TOUR, LEGEND, LAYER_TO_STEP } from './lib/architecture'
import { usePrefersReducedMotion } from './lib/useReducedMotion'

const PANELS = {
  input: InputImageDemo,
  convolution: FilterConvolutionDemo,
  featuremaps: FeatureMapDemo,
  pooling: PoolingDemo,
  deep: DeepLayersDemo,
  dense: DenseLayerDemo,
  softmax: SoftmaxOutput,
}

export default function App() {
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  // Bumped on every navigation so the camera re-flies even to the same step.
  const [flightKey, setFlightKey] = useState(0)
  // Bumped only by Restart, so panel demos remount and replay from the start.
  const [runKey, setRunKey] = useState(0)
  // 'schematic' = legible block depths, 'sqrt' = compressed channel count,
  // 'linear' = depth directly proportional to the channel count.
  const [depthMode, setDepthMode] = useState('linear')

  const goto = useCallback((next) => {
    setIndex((cur) => {
      const clamped = Math.min(TOUR.length - 1, Math.max(0, next))
      if (clamped !== cur) setFlightKey((k) => k + 1)
      return clamped
    })
  }, [])

  const next = useCallback(() => goto(index + 1), [goto, index])
  const back = useCallback(() => goto(index - 1), [goto, index])
  /** Overview: fly back to the wide shot at step 0. */
  const overview = useCallback(() => {
    setIndex(0)
    setFlightKey((k) => k + 1)
  }, [])

  /** Restart: back to step 0 and replay every demo from its first frame. */
  const restart = useCallback(() => {
    setIndex(0)
    setFlightKey((k) => k + 1)
    setRunKey((k) => k + 1)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      // Don't hijack keys while the presenter is in a button/input.
      const tag = e.target?.tagName
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable
      if (typing) return

      if (e.key === 'ArrowRight' || e.key === ' ' || e.code === 'Space') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        back()
      } else if (e.key === 'r' || e.key === 'R') {
        restart()
      } else if (e.key === 'o' || e.key === 'O') {
        overview()
      } else if (e.key === 'd' || e.key === 'D') {
        setDepthMode((m) => {
          const order = ['schematic', 'sqrt', 'linear']
          return order[(order.indexOf(m) + 1) % order.length]
        })
        setFlightKey((k) => k + 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, back, restart, overview])

  const step = TOUR[index]
  const Panel = step.panel ? PANELS[step.panel] : null

  const onSelectLayer = useCallback(
    (id) => {
      if (!id) return
      const target = LAYER_TO_STEP[id]
      if (target != null) goto(target)
    },
    [goto]
  )

  return (
    <div className="app">
      <div className="stage">
        <ArchitectureScene
          stepIndex={index}
          reduced={reduced}
          onSelectLayer={onSelectLayer}
          flightKey={flightKey}
          depthMode={depthMode}
        />
      </div>

      <header className="titlebar">
        <h1>AlexNet: A Guided Journey Through the Architecture</h1>
        <p className="titlebar__sub">From pixel values to class probabilities</p>
      </header>

      {/* Top-right stack: legend (overview only) above the depth toggle, so the
          two never overlap each other or the control bar. */}
      <div className="topright">
        {index === 0 && (
          <aside className="legend" aria-label="Colour legend">
            {LEGEND.map((l) => (
              <span key={l.label} className="legend__item">
                <span className="legend__swatch" style={{ background: l.color }} />
                {l.label}
              </span>
            ))}
            <span className="legend__note">
              AlexNet was divided across two GPUs for computational reasons. Together, both parts
              form one model.
            </span>
          </aside>
        )}

        <div className="depthtoggle">
          <span className="depthtoggle__label">Block depth</span>
          <div className="depthtoggle__btns" role="group" aria-label="Block depth of the layers">
            {[
              ['schematic', 'Schematic'],
              ['sqrt', '√ channels'],
              ['linear', 'Linear'],
            ].map(([id, label]) => (
              <button
                key={id}
                className={`chip ${depthMode === id ? 'is-on' : ''}`}
                aria-pressed={depthMode === id}
                onClick={() => {
                  setDepthMode(id)
                  setFlightKey((k) => k + 1)
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="depthtoggle__hint">
            {depthMode === 'linear'
              ? 'Depth ∝ channels · true ratios · 3 … 384'
              : depthMode === 'sqrt'
                ? 'Depth ∝ √channels · ordering exact, ratios compressed'
                : 'Depth chosen for readability'}
          </span>
        </div>
      </div>

      {/* The narration block: one short sentence at a time. */}
      <section className="narration" aria-live="polite">
        <span className="narration__step">{step.title}</span>
        <p className="narration__headline">{step.headline}</p>
        <div className="narration__facts">
          {step.facts.map((f) => (
            <span key={f} className="fact">
              {f}
            </span>
          ))}
        </div>
      </section>

      {Panel && (
        <section className="panel" key={`${step.id}-${runKey}`}>
          <Panel reduced={reduced} />
        </section>
      )}

      <footer className="footerbar">
        <TourControls
          index={index}
          onNext={next}
          onBack={back}
          onRestart={restart}
          onOverview={overview}
        />
        <p className="hint">
          Drag to orbit · scroll to zoom · click a layer to focus · → / Space next · ← back · R
          restart · O overview · D block depth
        </p>
      </footer>
    </div>
  )
}
