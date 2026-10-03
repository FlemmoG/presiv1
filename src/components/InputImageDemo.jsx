import { useEffect, useMemo, useState } from 'react'
import { makePatchRGB } from '../lib/patterns'

const N = 6 // conceptual close-up

/**
 * Step 1: the image becomes numbers. Animates from a "photo" into a labelled
 * RGB pixel grid so the audience sees that the model receives values, not a concept.
 */
export default function InputImageDemo({ reduced }) {
  const patch = useMemo(() => makePatchRGB(N), [])
  const [phase, setPhase] = useState(reduced ? 1 : 0)

  useEffect(() => {
    if (reduced) return
    const t = setTimeout(() => setPhase(1), 700)
    return () => clearTimeout(t)
  }, [reduced])

  const channels = [
    { key: 'r', name: 'R', tint: '#ff6b6b' },
    { key: 'g', name: 'G', tint: '#51cf66' },
    { key: 'b', name: 'B', tint: '#4dabf7' },
  ]

  return (
    <div className="demo demo--input">
      <div className="demo__head">
        <div>
          <div className="demo__kicker">224 × 224 × 3 numerical pixel values</div>
          <p className="demo__lede">
            The model never receives the concept “dog.” It receives numbers describing colour and
            brightness.
          </p>
        </div>
        {!reduced && (
          <button className="chip" onClick={() => setPhase((p) => (p === 0 ? 1 : 0))}>
            {phase === 0 ? 'Show numbers' : 'Show image'}
          </button>
        )}
      </div>

      <div className="input-stage">
        <figure className={`photo ${phase === 1 ? 'photo--faded' : ''}`}>
          <div className="photo__frame" role="img" aria-label="Illustrative input photograph">
            <div className="photo__scene">
              <span className="photo__sky" />
              <span className="photo__subject" />
              <span className="photo__ground" />
            </div>
          </div>
          <figcaption>Input image</figcaption>
        </figure>

        <span className="input-arrow" aria-hidden="true">→</span>

        <figure className={`numgrid ${phase === 1 ? 'numgrid--in' : ''}`}>
          <div className="numgrid__row">
            {channels.map((ch) => (
              <div key={ch.key} className="chan">
                <div className="chan__name" style={{ color: ch.tint }}>
                  {ch.name}
                </div>
                <div className="chan__grid" style={{ '--n': N }}>
                  {patch.map((row, y) =>
                    row.map((px, x) => (
                      <span key={`${x}-${y}`} className="chan__cell">
                        {Math.round(px[ch.key] * 255)}
                      </span>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
          <figcaption>
            Conceptual close-up · a {N} × {N} corner of the 224 × 224 grid, three colour channels
          </figcaption>
        </figure>
      </div>

      <div className="callouts">
        <span className="callout">Each pixel = three numbers (red, green, blue)</span>
        <span className="callout">Values shown 0–255 · one small region only</span>
      </div>
    </div>
  )
}
