import { TOUR } from '../lib/architecture'

/** Minimal presentation bar. Every control is a real, focusable button. */
export default function TourControls({ index, onNext, onBack, onRestart, onOverview }) {
  const atStart = index === 0
  const atEnd = index === TOUR.length - 1
  // "Step 2 of 7": step 0 is the overview, so the tour proper has 7 steps.
  const total = TOUR.length - 1

  return (
    <div className="controls" role="group" aria-label="Guided tour controls">
      <div className="controls__progress" aria-live="polite">
        {index === 0 ? 'Overview' : `Step ${index} of ${total}`}
        {index > 0 && <span className="controls__stepname">{TOUR[index].title}</span>}
      </div>

      <div className="controls__dots" aria-hidden="true">
        {TOUR.map((s, i) => (
          <span key={s.id} className={`dot ${i === index ? 'is-on' : ''} ${i < index ? 'is-past' : ''}`} />
        ))}
      </div>

      <div className="controls__buttons">
        <button className="btn" onClick={onOverview} aria-label="Return to overview (keyboard: O)">
          Overview
        </button>
        <button className="btn" onClick={onRestart} aria-label="Restart tour (keyboard: R)">
          Restart
        </button>
        <button className="btn" onClick={onBack} disabled={atStart} aria-label="Previous step (keyboard: left arrow)">
          Back
        </button>
        <button
          className="btn btn--primary"
          onClick={onNext}
          disabled={atEnd}
          aria-label="Next step (keyboard: right arrow or space)"
        >
          Next
        </button>
      </div>
    </div>
  )
}
