import { useMemo } from 'react'

const MAPS = 6 // sampled feature maps from Pool5
const VEC = 20 // sampled entries of the flattened vector
const N6 = 7 // sampled units drawn for FC6
const N7 = 7 // sampled units drawn for FC7
const N8 = 5 // sampled units drawn for FC8

/**
 * Step 6: Pool5 feature maps flatten into a long vector, which passes through
 * all three fully connected layers.
 *
 * FC6 and FC7 have 4,096 units each; FC8 has 1,000 — one score per ImageNet
 * class. Connections are a small visual sample and are labelled as such.
 */
export default function DenseLayerDemo() {
  const COLS = useMemo(
    () => [
      { id: 'vec', x: 40, n: VEC, r: 3, label: 'Feature vector', kind: 'vec' },
      { id: 'fc6', x: 128, n: N6, r: 6, label: 'FC6', sub: '4,096 units', kind: 'node' },
      { id: 'fc7', x: 212, n: N7, r: 6, label: 'FC7', sub: '4,096 units', kind: 'node' },
      { id: 'fc8', x: 292, n: N8, r: 6, label: 'FC8', sub: '1,000 scores', kind: 'out' },
    ],
    []
  )

  const yOf = (col, i) => {
    const top = 18
    const height = 150
    return col.n === 1 ? top + height / 2 : top + (i * height) / (col.n - 1)
  }

  // Deterministic sample of connections between consecutive columns.
  const links = useMemo(() => {
    const out = []
    for (let c = 0; c < COLS.length - 1; c++) {
      const a = COLS[c]
      const b = COLS[c + 1]
      for (let j = 0; j < b.n; j++) {
        for (let k = 0; k < 3; k++) {
          out.push({ c, ai: (j * 3 + k * 5 + c) % a.n, bi: j })
        }
      }
    }
    return out
  }, [COLS])

  return (
    <div className="demo demo--dense">
      <div className="demo__head">
        <div>
          <div className="demo__kicker">Three fully connected layers</div>
          <p className="demo__lede">
            In a dense layer, every neuron is connected to every neuron in the previous layer.
          </p>
        </div>
      </div>

      <div className="dense-stage">
        <figure className="dense-maps">
          <div className="dense-maps__stack" role="img" aria-label="Final convolutional feature maps">
            {Array.from({ length: MAPS }, (_, i) => (
              <span key={i} className="dense-maps__plane" style={{ '--i': i }} />
            ))}
          </div>
          <figcaption>
            Pool5 feature maps
            <br />6 × 6 × 256
          </figcaption>
        </figure>

        <span className="dense-flat" aria-hidden="true">
          flatten →
        </span>

        <svg
          className="dense-svg"
          viewBox="0 0 320 210"
          role="img"
          aria-label="The flattened feature vector passes through FC6 (4,096 units), FC7 (4,096 units) and FC8 (1,000 class scores). A representative sample of connections is drawn."
        >
          {links.map((l, i) => {
            const a = COLS[l.c]
            const b = COLS[l.c + 1]
            return (
              <line
                key={i}
                x1={a.x + (a.kind === 'vec' ? 8 : a.r)}
                y1={yOf(a, l.ai)}
                x2={b.x - b.r}
                y2={yOf(b, l.bi)}
                className="dense-svg__link"
              />
            )
          })}

          {COLS.map((col) =>
            Array.from({ length: col.n }, (_, i) =>
              col.kind === 'vec' ? (
                <rect
                  key={`${col.id}-${i}`}
                  x={col.x - 16}
                  y={yOf(col, i) - 2.6}
                  width="24"
                  height="5.2"
                  rx="1.4"
                  className="dense-svg__vec"
                />
              ) : (
                <circle
                  key={`${col.id}-${i}`}
                  cx={col.x}
                  cy={yOf(col, i)}
                  r={col.r}
                  className={col.kind === 'out' ? 'dense-svg__node dense-svg__node--out' : 'dense-svg__node'}
                />
              )
            )
          )}

          {COLS.map((col) => (
            <g key={`lab-${col.id}`}>
              <text x={col.x} y={188} className="dense-svg__cap" textAnchor="middle">
                {col.label}
              </text>
              {col.sub && (
                <text x={col.x} y={200} className="dense-svg__sub" textAnchor="middle">
                  {col.sub}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      <div className="callouts">
        <span className="callout">Dense 1 / FC6 · 4,096 units</span>
        <span className="callout">Dense 2 / FC7 · 4,096 units</span>
        <span className="callout">Dense 3 / FC8 · 1,000 class scores</span>
        <span className="callout callout--muted">
          Representative connections shown · a real layer has millions
        </span>
      </div>
    </div>
  )
}
