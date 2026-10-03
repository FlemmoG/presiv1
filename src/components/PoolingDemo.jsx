import { useEffect, useMemo, useState } from 'react'
import { POOL_INPUT, POOL_WINDOW, POOL_STRIDE, poolRegions } from '../lib/patterns'

/**
 * Step 4: overlapping max-pooling, using AlexNet's real geometry.
 *
 * A 3 × 3 window moves with stride 2 over a 5 × 5 activation grid, producing a
 * 2 × 2 output. Because the stride is smaller than the window, consecutive
 * windows share a row/column — the demo marks that shared band so "overlapping"
 * is something the audience can see rather than just read.
 */
export default function PoolingDemo({ reduced }) {
  const regions = useMemo(() => poolRegions(), [])
  const n = POOL_INPUT.length
  // The cycle has one extra state at the end showing every pooled output.
  const [i, setI] = useState(reduced ? regions.length : 0)

  useEffect(() => {
    if (reduced) return
    const t = setInterval(() => setI((p) => (p + 1) % (regions.length + 1)), 1100)
    return () => clearInterval(t)
  }, [reduced, regions.length])

  const active = i < regions.length ? regions[i] : null

  // Indices covered by more than one window position — the shared band that
  // makes this pooling "overlapping". With starts {0, 2} and a 3-wide window
  // that is exactly index 2.
  const overlap = useMemo(() => {
    const starts = [...new Set(regions.map((r) => r.x0))]
    const counts = new Map()
    for (const a of starts) {
      for (let k = 0; k < POOL_WINDOW; k++) {
        const c = a + k
        counts.set(c, (counts.get(c) ?? 0) + 1)
      }
    }
    return new Set([...counts].filter(([, v]) => v > 1).map(([c]) => c))
  }, [regions])

  return (
    <div className="demo demo--pool">
      <div className="demo__head">
        <div>
          <div className="demo__kicker">
            Max-pooling · {POOL_WINDOW} × {POOL_WINDOW} window · stride {POOL_STRIDE}
          </div>
          <p className="demo__lede">
            Each window keeps only its largest value, so the map shrinks while the strongest
            responses survive.
          </p>
        </div>
      </div>

      <div className="pool-stage">
        <figure>
          <div
            className="pool-grid"
            style={{ '--n': n }}
            role="img"
            aria-label={`${n} by ${n} activation grid with a ${POOL_WINDOW} by ${POOL_WINDOW} pooling window`}
          >
            {POOL_INPUT.map((row, y) =>
              row.map((v, x) => {
                const inWin =
                  active &&
                  x >= active.x0 &&
                  x < active.x0 + POOL_WINDOW &&
                  y >= active.y0 &&
                  y < active.y0 + POOL_WINDOW
                const isMax = active && active.maxCell[0] === x && active.maxCell[1] === y
                const isOverlap = overlap.has(x) && overlap.has(y)
                return (
                  <span
                    key={`${x}-${y}`}
                    className={`pool-cell ${inWin ? 'pool-cell--in' : ''} ${
                      isMax ? 'pool-cell--max' : ''
                    } ${isOverlap && !inWin ? 'pool-cell--overlap' : ''}`}
                    style={{ background: `rgba(61, 220, 151, ${0.08 + v * 0.5})` }}
                  >
                    {v.toFixed(2)}
                  </span>
                )
              })
            )}
          </div>
          <figcaption>
            Activation grid · {n} × {n}
          </figcaption>
        </figure>

        <span className="pool-arrow" aria-hidden="true">
          →
        </span>

        <figure>
          <div
            className="pool-grid pool-grid--out"
            style={{ '--n': 2 }}
            role="img"
            aria-label="2 by 2 pooled output"
          >
            {regions.map((r, idx) => {
              const on = idx <= i - 1 || i >= regions.length
              return (
                <span
                  key={idx}
                  className={`pool-cell pool-cell--out ${
                    active && idx === i ? 'pool-cell--pending' : ''
                  }`}
                  style={{
                    background: on
                      ? `rgba(61, 220, 151, ${0.14 + r.max * 0.6})`
                      : 'rgba(255,255,255,0.04)',
                  }}
                >
                  {on ? r.max.toFixed(2) : ''}
                </span>
              )
            })}
          </div>
          <figcaption>Pooled output · 2 × 2</figcaption>
        </figure>
      </div>

      <div className="callouts">
        <span className="callout">AlexNet uses overlapping max-pooling</span>
        <span className="callout">3 × 3 pooling window, stride 2</span>
        <span className="callout callout--muted">
          Stride 2 is smaller than the 3 × 3 window, so neighbouring windows share cells — that is
          what makes the pooling overlapping
        </span>
      </div>
    </div>
  )
}
