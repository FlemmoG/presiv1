import { useMemo } from 'react'
import { DEEP_STAGES, makeDeepMap } from '../lib/patterns'

/**
 * Step 5: the abstraction ladder. Grids get smaller and sparser with depth.
 * Wording stays careful: "object-related patterns", never "detects a dog's ear".
 */
export default function DeepLayersDemo() {
  const stages = useMemo(
    () => DEEP_STAGES.map((s, i) => ({ ...s, grid: makeDeepMap(s.res, i + 1) })),
    []
  )

  return (
    <div className="demo demo--deep">
      <div className="demo__head">
        <div>
          <div className="demo__kicker">Geometry → textures → shapes → object-related features</div>
          <p className="demo__lede">
            As the network gets deeper, spatial dimensions generally shrink, while the number of
            feature channels changes to support richer representations.
          </p>
        </div>
      </div>

      <div className="deep-stage">
        {stages.map((s, idx) => (
          <figure key={s.id} className="deep-card" style={{ '--s': s.scale }}>
            <div className="deep-card__head">
              <span className="deep-card__name">{s.label}</span>
              <span className="deep-card__dims">{s.dims}</span>
            </div>
            <div
              className="deep-grid"
              style={{ '--n': s.res }}
              role="img"
              aria-label={`${s.label}: ${s.caption}`}
            >
              {s.grid.map((row, y) =>
                row.map((v, x) => (
                  <span
                    key={`${x}-${y}`}
                    className="deep-cell"
                    style={{ background: `rgba(78, 168, 255, ${0.05 + v * 0.8})` }}
                  />
                ))
              )}
            </div>
            <figcaption>{s.caption}</figcaption>
            {idx < stages.length - 1 && <span className="deep-card__arrow" aria-hidden="true">→</span>}
          </figure>
        ))}
      </div>

      <div className="callouts">
        <span className="callout">Deeper layers respond to more complex and object-related patterns</span>
        <span className="callout callout--muted">
          Conceptual illustration · the network does not understand objects the way people do
        </span>
      </div>
    </div>
  )
}
