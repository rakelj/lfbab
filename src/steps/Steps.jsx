import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/I18n.jsx'
import { ACTIVITIES, ACTORS, EMOTIONS, RIGHTS_CARDS, STORIES, img } from '../content.js'
import StaffCard from '../components/StaffCard.jsx'
import { ActorInfoButton } from '../components/ActorCard.jsx'

// Back (when there is somewhere to go back to) and Next.
function StepNav({ onBack, onNext, nextLabel, nextDisabled }) {
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
function AnswerButtons({ options, value, onAnswer }) {
  const { t } = useI18n()
  return (
    <div className={`answers ${value ? 'answered' : ''}`}>
      {options.map((o) => (
        <button key={o} className={`answer answer-${o} ${value === o ? 'selected' : ''}`} aria-pressed={value === o} onClick={() => onAnswer(o)}>
          {t(`q.${o}`)}
        </button>
      ))}
    </div>
  )
}

function RightBox({ text }) {
  const { t } = useI18n()
  return (
    <div className="right-box">
      <span className="label">{t('q.rightLabel')}</span>
      <p>{t(text)}</p>
    </div>
  )
}

export function InfoStep({ step, onNext, onBack }) {
  const { t } = useI18n()
  return (
    <>
      {step.img && <img className="illustration" src={step.img} alt="" />}
      <h1>{t(step.title)}</h1>
      <p className="lead">{t(step.text)}</p>
      <StepNav onBack={onBack} onNext={onNext} />
    </>
  )
}

// Validation after a "true for you?" answer: says it's not their fault and that
// others feel the same. Each question has its own text per answer.
function Validation({ id, value }) {
  const { t, has } = useI18n()
  const key = `${id}.validate.${value}`
  const text = has(key) ? t(key) : value === 'yes' ? t('q.thanks') : t('q.notAlone')
  return (
    <div className={`validation validation-${value}`}>
      {value !== 'yes' && <img src={img('friends.png')} alt="" />}
      <p>{text}</p>
    </div>
  )
}

// "True for you?": no right answer. Yes gets a nod; No / Don't know gets
// validation and a card to show staff.
export function SelfStep({ step, value, onChange, onNext, onBack }) {
  const { t } = useI18n()
  return (
    <>
      {step.img && <img className="illustration illustration-small" src={step.img} alt="" />}
      <span className="label">{t('q.selfLabel')}</span>
      <h1 className="statement">«{t(`${step.id}.q`)}»</h1>
      <AnswerButtons options={['yes', 'no', 'dontKnow']} value={value} onAnswer={onChange} />
      {value && (
        <div className="feedback" key={value}>
          <Validation id={step.id} value={value} />
          <RightBox text={`${step.id}.right`} />
          {value !== 'yes' && <StaffCard textKey={`${step.id}.staff`} />}
        </div>
      )}
      <StepNav onBack={onBack} onNext={onNext} nextLabel={value ? undefined : t('common.skip')} />
    </>
  )
}

// "Did you know?": has a correct answer, but the feedback never says "wrong".
export function MythStep({ step, value, onChange, onNext, onBack }) {
  const { t } = useI18n()
  return (
    <>
      <span className="label">{t('q.mythLabel')}</span>
      <h1 className="statement">«{t(`${step.id}.q`)}»</h1>
      <AnswerButtons options={['true', 'false', 'dontKnow']} value={value} onAnswer={onChange} />
      {value && (
        <div className="feedback" key={value}>
          <p className="reassure">{value === step.correct ? t('q.mythGotIt') : t('q.mythCommon')}</p>
          <RightBox text={`${step.id}.right`} />
        </div>
      )}
      <StepNav onBack={onBack} onNext={onNext} nextLabel={value ? undefined : t('common.skip')} />
    </>
  )
}

// Body and mind: reveal the chain one link at a time. Back steps back through the links.
export function ChainStep({ onNext, onBack, cameBack }) {
  const { t } = useI18n()
  const links = ['ch2.chain.1', 'ch2.chain.2', 'ch2.chain.3']
  const [shown, setShown] = useState(cameBack ? links.length + 1 : 1)
  const complete = shown > links.length

  return (
    <>
      <h1>{t('ch2.chain.title')}</h1>
      <img className="illustration" src={img('health-figures.png')} alt="" />
      <ol className="chain">
        {links.slice(0, shown).map((k) => (
          <li key={k}>{t(k)}</li>
        ))}
      </ol>
      {complete && (
        <>
          <img className="illustration" src={img('health-cycle.png')} alt="" />
          <p className="lead">{t('ch2.chain.text')}</p>
        </>
      )}
      <StepNav onBack={shown > 1 ? () => setShown(shown - 1) : onBack} onNext={complete ? onNext : () => setShown(shown + 1)} />
    </>
  )
}

// The story picked in an earlier step (Hamlin's if none was picked).
const storyOf = (step, answers) => STORIES[answers[step.storyFrom]] ?? STORIES.quiet

// Content note, then pick one of the stories, or skip them.
export function StoryChoiceStep({ step, value, onChange, onNext, onBack, onSkipTo }) {
  const { t } = useI18n()
  return (
    <>
      <p className="lead">{t(step.text)}</p>
      <div className="story-choices">
        {Object.entries(STORIES).map(([id, s]) => (
          <button
            key={id}
            className={`story-choice ${value === id ? 'selected' : ''}`}
            onClick={() => {
              onChange(id)
              onNext()
            }}
          >
            <img src={s.cover} alt="" />
            <strong>{t(s.title)}</strong>
          </button>
        ))}
      </div>
      <div className="actions">
        {onBack && (
          <button className="btn btn-secondary" onClick={onBack}>
            {t('common.back')}
          </button>
        )}
        <button className="btn btn-secondary" onClick={() => onSkipTo(step.skipTo)}>
          {t('common.skip')}
        </button>
      </div>
    </>
  )
}

export function StoryStep({ step, answers, onNext, onBack, cameBack }) {
  const { t } = useI18n()
  const story = storyOf(step, answers)
  const [i, setI] = useState(cameBack ? story.panels.length - 1 : 0)
  const panel = story.panels[i]
  const last = i === story.panels.length - 1

  return (
    <div className="story">
      <h1>{t(story.title)}</h1>
      {/* keys restart the slow zoom and the text fade for each panel */}
      <div className="story-frame">
        <img key={panel.img} className="story-panel" src={panel.img} alt="" />
      </div>
      <p key={panel.text} className="story-text">
        {t(panel.text)}
      </p>
      <StepNav onBack={i > 0 ? () => setI(i - 1) : onBack} onNext={last ? onNext : () => setI(i + 1)} />
    </div>
  )
}

export function EmotionsStep({ step, answers, value, onChange, onNext, onBack }) {
  const { t } = useI18n()
  const { name } = storyOf(step, answers)
  const picked = value ? value.split(',') : []
  const toggle = (id) => {
    const nextPicked = picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id]
    onChange(nextPicked.join(','))
  }

  return (
    <>
      <h1>{t('story.emotions.title', { name })}</h1>
      <p className="lead">{t(`${step.id}.text`)}</p>
      <div className="card-grid">
        {EMOTIONS.map((e) => (
          <button key={e.id} className={`pick-card ${picked.includes(e.id) ? 'selected' : ''}`} aria-pressed={picked.includes(e.id)} onClick={() => toggle(e.id)}>
            <img src={e.img} alt={t(`emotion.${e.id}`)} />
          </button>
        ))}
      </div>
      {picked.length > 0 && <p className="reassure">{t('story.emotions.after', { name })}</p>}
      <StepNav onBack={onBack} onNext={onNext} nextLabel={picked.length ? undefined : t('common.skip')} />
    </>
  )
}

// Tap actors in the order you'd ask them; tap again to remove.
export function HelpersStep({ step, answers, value, onChange, onNext, onBack }) {
  const { t } = useI18n()
  const { name } = storyOf(step, answers)
  const order = value ? value.split('>') : []
  const toggle = (id) => {
    const nextOrder = order.includes(id) ? order.filter((x) => x !== id) : [...order, id]
    onChange(nextOrder.join('>'))
  }

  return (
    <>
      <h1>{t('story.helpers.title', { name })}</h1>
      <p className="lead">{t(`${step.id}.text`)}</p>
      <div className="card-grid">
        {ACTORS.map((a) => {
          const n = order.indexOf(a.id)
          return (
            <button key={a.id} className={`pick-card ${n >= 0 ? 'selected' : ''}`} aria-pressed={n >= 0} onClick={() => toggle(a.id)}>
              <img src={a.img} alt={t(`actor.${a.id}`)} />
              {n >= 0 && <span className="order-badge">{n + 1}</span>}
              <ActorInfoButton actor={a} />
            </button>
          )
        })}
      </div>
      {order.length > 0 && <p className="reassure">{t(`${step.id}.after`)}</p>}
      <StepNav onBack={onBack} onNext={onNext} nextLabel={order.length ? undefined : t('common.skip')} />
    </>
  )
}

export function ActivitiesStep({ step, value, onChange, onNext, onBack }) {
  const { t } = useI18n()
  const picked = value ? value.split(',') : []
  const toggle = (id) => onChange((picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id]).join(','))

  return (
    <>
      <h1>{t(`${step.id}.title`)}</h1>
      <p className="lead">{t(`${step.id}.text`)}</p>
      <div className="activity-grid">
        {ACTIVITIES.map((a) => (
          <button key={a.id} className={`activity-card ${picked.includes(a.id) ? 'selected' : ''}`} aria-pressed={picked.includes(a.id)} onClick={() => toggle(a.id)}>
            <span className={`activity-img ${a.cutout ? 'cutout' : ''}`}>
              <img src={a.img} alt="" />
            </span>
            <span className="activity-label">{t(`activity.${a.id}`)}</span>
          </button>
        ))}
      </div>
      {picked.length > 0 && <p className="reassure">{t(`${step.id}.after`)}</p>}
      <StepNav onBack={onBack} onNext={onNext} nextLabel={picked.length ? undefined : t('common.skip')} />
    </>
  )
}

// Summary for the activities chapter, with a staff card that names the activities picked.
export function ActivitySummaryStep({ step, answers, onNext, onBack }) {
  const { t, tStaff } = useI18n()
  const picked = answers[step.activitiesFrom] ? answers[step.activitiesFrom].split(',') : []
  const phrases = picked.map((id) => tStaff(`activity.${id}.staff`))
  const list = phrases.length > 1 ? `${phrases.slice(0, -1).join(', ')} ${tStaff('ch3.staff.and')} ${phrases.at(-1)}` : phrases[0]
  const staffText = list ? `${tStaff('ch3.staff.start')} ${list}. ${tStaff('ch3.staff.end')}` : tStaff('ch3.staff.none')

  return (
    <>
      <h1>{t(step.title)}</h1>
      <ul className="summary">
        {step.items.map((k) => (
          <li key={k}>{t(k)}</li>
        ))}
      </ul>
      <StaffCard text={staffText} />
      <StepNav onBack={onBack} onNext={onNext} />
    </>
  )
}

export function SummaryStep({ step, onNext, onBack }) {
  const { t } = useI18n()
  return (
    <>
      <h1>{t(step.title)}</h1>
      <ul className="summary">
        {step.items.map((k) => (
          <li key={k}>{t(k)}</li>
        ))}
      </ul>
      {step.note && <p className="reassure">{t(step.note)}</p>}
      {step.staff && <StaffCard textKey={step.staff} />}
      <StepNav onBack={onBack} onNext={onNext} />
    </>
  )
}

export function CardStep({ step, onComplete, onExit }) {
  const { t } = useI18n()
  const card = RIGHTS_CARDS[step.card]

  useEffect(() => {
    onComplete()
  }, [])

  return (
    <div className="screen-center">
      <span className="label">{t('card.label')}</span>
      {/* The card turns over from its back, with a few sparkles around it */}
      <div className="reward">
        <div className="reward-card">
          <div className="rights-card reward-front">
            <img src={card.img} alt="" />
            <p>{t(card.text)}</p>
          </div>
          <div className="reward-back" aria-hidden="true" />
        </div>
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={`sparkle sparkle-${n}`} aria-hidden="true">
            ✦
          </span>
        ))}
      </div>
      <StepNav onNext={onExit} nextLabel={t('common.toHub')} />
    </div>
  )
}
