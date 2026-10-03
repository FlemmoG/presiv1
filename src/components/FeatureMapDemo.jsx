import { useMemo } from 'react'
import { makePatchRGB, makeFeatureMap } from '../lib/patterns'

const OUT = 10

const FILTERS = [
  { kind: 'edge', name: 'Filter 1', role: 'Edge detector', hue: '#4ea8ff' },
  { kind: 'color', name: 'Filter 2', role: 'Colour / orientation detector', hue: '#ff9f45' },
  { kind: 'texture', name: 'Filter 3', role: 'Texture detector', hue: '#3ddc97' },
]

/**
 * Step 3: the same image, three different filters, three different feature maps.
 * Makes the one-filter-one-map relationship concrete.
 */
export default function FeatureMapDemo() {
  const patch = useMemo(() => makePatchRGB(27), [])
  const maps = useMemo(
    () => FILTERS.map((f) => ({ ...f, grid: makeFeatureMap(patch, f.kind, OUT) })),
    [patch]
  )

  return (
    <div className="demo demo--maps">
      <div className="demo__head">
        <div>
          <div className="demo__kicker">AlexNet Conv1: 96 learned filters</div>
          <p className="demo__lede">
            One filter produces one feature map. Many filters produce many feature maps.
          </p>
        </div>
      </div>

      <div className="maps-stage">
        <figure className="maps-source">
          <div className="grid-badge">Conceptual close-up</div>
          <div className="pixel-grid pixel-grid--sm" style={{ '--cell': '6px', '--n': 27 }} role="img" aria-label="Shared input region">
            {patch.map((row, y) =>
              row.map((px, x) => (
                <span
                  key={`${x}-${y}`}
                  className="px"
                  style={{ background: `rgb(${px.r * 255 | 0},${px.g * 255 | 0},${px.b * 255 | 0})` }}
                />
              ))
            )}
          </div>
          <figcaption>Same input region</figcaption>
        </figure>

        <span className="maps-fan" aria-hidden="true">
          <span /><span /><span />
        </span>

        <div className="maps-list">
          {maps.map((m) => (
            <figure key={m.kind} className="map-card">
              <div className="map-card__head">
                <span className="map-card__dot" style={{ background: m.hue }} />
                <span className="map-card__name">{m.name}</span>
                <span className="map-card__role">{m.role}</span>
              </div>
              <div
                className="map-grid"
                style={{ '--n': OUT }}
                role="img"
                aria-label={`${m.name}, ${m.role}: conceptual feature map`}
              >
                {m.grid.map((row, y) =>
                  row.map((v, x) => (
                    <span
                      key={`${x}-${y}`}
                      className="map-cell"
                      style={{ background: `color-mix(in srgb, ${m.hue} ${(v * 100).toFixed(0)}%, #0b1120)` }}
                    />
                  ))
                )}
              </div>
            </figure>
          ))}
        </div>
      </div>

      <div className="callouts">
        <span className="callout">The three filters shown are representative examples, not the complete layer</span>
        <span className="callout">Conceptual patterns · not activations from a trained network</span>
      </div>
    </div>
  )
}
