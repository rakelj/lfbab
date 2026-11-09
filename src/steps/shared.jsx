import { useI18n } from '../i18n/I18n.jsx'
import { Speak } from '../components/Sound.jsx'
import { ACTORS, STORIES, img } from '../content.js'
import CardName from '../components/CardName.jsx'

// Pieces shared by several step types.

// Back (when there is somewhere to go back to) and Next.
export function StepNav({ onBack, onNext, nextLabel, nextDisabled }) {
  const { t } = useI18n()
  return (
    <div className="actions">
      {onBack && (
        <button className="btn btn-secondary" onClick={onBack}>
          {t('common.back')}
        </button>
      )}
      <button className="btn btn-primary" disabled={nextDisabled} onClick={onNext}>
        {nextLabel ?? t('common.next')}
      </button>
    </div>
  )
}

// Answers can be changed at any time: tapping another option just moves the selection.
export function AnswerButtons({ options, value, onAnswer }) {
  const { t } = useI18n()
  return (
    <div className={`answers ${value ? 'answered' : ''}`}>
      {options.map((o) => (
        <div key={o} className="answer-cell">
          <button className={`answer answer-${o} ${value === o ? 'selected' : ''}`} aria-pressed={value === o} onClick={() => onAnswer(o)}>
            {t(`q.${o}`)}
          </button>
          <Speak text={t(`q.${o}`)} className="speak-corner" />
        </div>
      ))}
    </div>
  )
}

export function RightBox({ text }) {
  const { t } = useI18n()
  return (
    <div className="right-box">
      <span className="label">{t('q.rightLabel')}</span>
      <p>
        {t(text)} <Speak text={`${t('q.rightLabel')}. ${t(text)}`} />
      </p>
    </div>
  )
}

// Validation after a "true for you?" answer: says it's not their fault and that
// others feel the same. Each question has its own text per answer.
// `ok` = the answer needs no comfort (Yes on a "true for you?", or the correct
// answer on a myth): green box, no picture. Otherwise pink box with the friends.
export function Validation({ id, value, ok, fallback }) {
  const { t, has } = useI18n()
  const key = `${id}.validate.${value}`
  const text = has(key) ? t(key) : t(fallback)
  return (
    <div className={`validation ${ok ? 'validation-ok' : ''}`}>
      {!ok && <img src={img('friends.png')} alt="" />}
      <p>
        {text} <Speak text={text} />
      </p>
    </div>
  )
}

// Grid of actor cards with a check mark on picked ones. The badge sits at the
// bottom so it never covers the name painted at the top of the card.
export function ActorGrid({ picked, onPick }) {
  const { t } = useI18n()
  return (
    <div className="card-grid">
      {ACTORS.map((a) => (
        <button key={a.id} className={`pick-card ${picked.includes(a.id) ? 'selected' : ''}`} aria-pressed={picked.includes(a.id)} onClick={() => onPick(a.id)}>
          <img src={a.img} alt={t(`actor.${a.id}`)} />
          <CardName text={t(`actor.${a.id}`)} overlay />
          {picked.includes(a.id) && (
            <span className="check-badge" aria-hidden="true">
              ✓
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

// The story picked in an earlier step (Hamlin's if none was picked).
export const storyOf = (step, answers) => STORIES[answers[step.storyFrom]] ?? STORIES.quiet
