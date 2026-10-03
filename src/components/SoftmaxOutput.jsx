import { useEffect, useState } from 'react'
import { SOFTMAX_CLASSES } from '../lib/architecture'

/**
 * Step 7: illustrative class probabilities. The numbers are invented for
 * teaching and are labelled as such.
 */
export default function SoftmaxOutput({ reduced }) {
  const [grown, setGrown] = useState(reduced)

  useEffect(() => {
    if (reduced) return
    const t = setTimeout(() => setGrown(true), 120)
    return () => clearTimeout(t)
  }, [reduced])

  return (
    <div className="demo demo--softmax">
      <div className="demo__head">
        <div>
          <div className="demo__kicker">Illustrative softmax output · 1,000 ImageNet classes</div>
          <p className="demo__lede">
            The final fully connected layer produces 1,000 class scores. Softmax then converts these
            scores into probabilities.
          </p>
        </div>
      </div>

      <div className="sm-pipeline">
        <div className="sm-stage sm-stage--scores">
          <span className="sm-stage__name">Dense 3 / FC8</span>
          <span className="sm-stage__sub">1,000 class scores / logits</span>
          <span className="sm-stage__tag">learned layer</span>
        </div>
        <span className="sm-pipeline__arrow" aria-hidden="true">→</span>
        <div className="sm-stage sm-stage--fn">
          <span className="sm-stage__glyph" aria-hidden="true">σ</span>
          <span className="sm-stage__name">Softmax function</span>
          <span className="sm-stage__sub">converts scores into probabilities</span>
          <span className="sm-stage__tag sm-stage__tag--fn">not a learned layer</span>
        </div>
        <span className="sm-pipeline__arrow" aria-hidden="true">→</span>
        <div className="sm-stage sm-stage--probs">
          <span className="sm-stage__name">Class probabilities</span>
          <span className="sm-stage__sub">1,000 values that sum to 1</span>
        </div>
      </div>

      <ul className="bars" aria-label="Illustrative class probabilities">
        {SOFTMAX_CLASSES.map((c, i) => (
          <li key={c.label} className={`bar ${i === 0 ? 'bar--top' : ''}`}>
            <span className="bar__label">{c.label}</span>
            <span className="bar__track">
              <span
                className="bar__fill"
                style={{
                  width: grown ? `${c.p * 100}%` : '0%',
                  transitionDelay: reduced ? '0ms' : `${i * 70}ms`,
                }}
              />
            </span>
            <span className="bar__val">{c.p.toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <div className="flow-recap" aria-hidden="true">
        <span>Raw pixels</span>
        <span className="flow-recap__arrow">→</span>
        <span>Learned visual features</span>
        <span className="flow-recap__arrow">→</span>
        <span>1,000 class scores</span>
        <span className="flow-recap__arrow">→</span>
        <span>1,000 class probabilities</span>
      </div>

      <div className="callouts">
        <span className="callout callout--muted">
          These numbers are illustrative only, not the output of a trained model
        </span>
      </div>
    </div>
  )
}
