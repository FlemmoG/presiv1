import { useEffect, useMemo, useRef, useState } from 'react'
import { makePatchRGB, filterResponse } from '../lib/patterns'

const PATCH = 27 // conceptual close-up, not the full 224 px image
const WIN = 11
const STRIDE = 4
const CELL = 10.5

// (27 - 11) / 4 + 1 = 5 positions per axis.
const STEPS = Math.floor((PATCH - WIN) / STRIDE) + 1

const FILTERS = [
  { kind: 'edge', name: 'Filter A', caption: 'responds to an edge' },
  { kind: 'color', name: 'Filter B', caption: 'responds to a colour transition' },
]

/**
 * Step 2: an 11 × 11 × 3 filter sliding over a pixel grid with stride 4.
 * Each position writes one value into the output feature map beside it.
 */
export default function FilterConvolutionDemo({ reduced }) {
  const patch = useMemo(() => makePatchRGB(PATCH), [])
  const [filterIdx, setFilterIdx] = useState(0)
  const [pos, setPos] = useState(0) // 0 .. STEPS*STEPS-1
  const [playing, setPlaying] = useState(!reduced)
  const timer = useRef(null)

  const filter = FILTERS[filterIdx]
  const total = STEPS * STEPS

  // Advance one filter position at a time so each stride jump is visible.
  useEffect(() => {
    if (!playing) return
    timer.current = setInterval(() => {
      setPos((p) => (p + 1) % total)
    }, 720)
    return () => clearInterval(timer.current)
  }, [playing, total])

  const ox = pos % STEPS
  const oy = Math.floor(pos / STEPS)

  // All output values produced so far, for the little feature-map grid.
  const outputs = useMemo(() => {
    const g = []
    for (let y = 0; y < STEPS; y++) {
      const row = []
      for (let x = 0; x < STEPS; x++) {
        row.push(filterResponse(patch, filter.kind, x * STRIDE, y * STRIDE, WIN))
      }
      g.push(row)
    }
    return g
  }, [patch, filter.kind])

  const revealed = (x, y) => y * STEPS + x <= pos
  const current = outputs[oy][ox]

  return (
    <div className="demo demo--conv">
      <div className="demo__head">
        <div>
          <div className="demo__kicker">Conv1 filter: 11 × 11 × 3 · Stride: 4</div>
          <p className="demo__lede">
            A filter scans local regions of the image and responds to a specific visual pattern.
          </p>
        </div>
        <div className="demo__filters" role="group" aria-label="Choose example filter">
          {FILTERS.map((f, i) => (
            <button
              key={f.kind}
              className={`chip ${i === filterIdx ? 'is-on' : ''}`}
              onClick={() => {
                setFilterIdx(i)
                setPos(0)
              }}
              aria-pressed={i === filterIdx}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>

      <div className="conv-stage">
        <figure className="conv-grid-wrap">
          <div className="grid-badge">Conceptual close-up</div>
          <div
            className="pixel-grid"
            style={{ '--cell': `${CELL}px`, '--n': PATCH }}
            role="img"
            aria-label={`Conceptual ${PATCH} by ${PATCH} pixel close-up of the input image`}
          >
            {patch.map((row, y) =>
              row.map((px, x) => {
                const inWin = x >= ox * STRIDE && x < ox * STRIDE + WIN && y >= oy * STRIDE && y < oy * STRIDE + WIN
                return (
                  <span
                    key={`${x}-${y}`}
                    className={`px ${inWin ? 'px--in' : ''}`}
                    style={{
                      background: `rgb(${px.r * 255 | 0}, ${px.g * 255 | 0}, ${px.b * 255 | 0})`,
                    }}
                  />
                )
              })
            )}
            <span
              className="filter-window"
              style={{
                width: `calc(var(--cell) * ${WIN})`,
                height: `calc(var(--cell) * ${WIN})`,
                transform: `translate(calc(var(--cell) * ${ox * STRIDE}), calc(var(--cell) * ${oy * STRIDE}))`,
                transition: reduced ? 'none' : 'transform 260ms cubic-bezier(.4,0,.2,1)',
              }}
            >
              <span className="filter-window__tag">11 × 11</span>
            </span>
          </div>
          <figcaption>
            Input pixels · a {PATCH} × {PATCH} region, not the full 224 × 224 image
          </figcaption>
        </figure>

        <div className="conv-arrow" aria-hidden="true">
          <span className="conv-arrow__line" />
          <span className="conv-arrow__val">{current.toFixed(2)}</span>
        </div>

        <figure className="conv-out-wrap">
          <div
            className="out-grid"
            style={{ '--n': STEPS }}
            role="img"
            aria-label={`Output feature map, position ${pos + 1} of ${total}`}
          >
            {outputs.map((row, y) =>
              row.map((v, x) => {
                const on = revealed(x, y)
                const isNow = x === ox && y === oy
                return (
                  <span
                    key={`${x}-${y}`}
                    className={`out-cell ${isNow ? 'out-cell--now' : ''}`}
                    style={{
                      background: on
                        ? `rgba(78, 168, 255, ${0.12 + v * 0.85})`
                        : 'rgba(255,255,255,0.035)',
                    }}
                  >
                    {on ? v.toFixed(1).replace('0.', '.') : ''}
                  </span>
                )
              })
            )}
          </div>
          <figcaption>Feature map · one value per filter position</figcaption>
        </figure>
      </div>

      <div className="conv-foot">
        <div className="callouts">
          <span className="callout">Filter = learned pattern detector</span>
          <span className="callout">Feature map = filter responses across the image</span>
        </div>
        <div className="conv-controls">
          <span className="conv-readout" aria-live="polite">
            {filter.name} {filter.caption} · position {pos + 1} / {total} · x step = 4 px
          </span>
          <button className="chip" onClick={() => setPlaying((p) => !p)} aria-pressed={playing}>
            {playing ? 'Pause' : 'Play'}
          </button>
          <button
            className="chip"
            onClick={() => {
              setPlaying(false)
              setPos((p) => (p + 1) % total)
            }}
          >
            Step
          </button>
        </div>
      </div>
    </div>
  )
}
