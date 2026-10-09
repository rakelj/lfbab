import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/I18n.jsx'
import { ACTIVITIES, ACTORS, EMOTIONS, RIGHTS_CARDS, STORIES, img } from '../content.js'
import StaffCard from '../components/StaffCard.jsx'
import { Speak } from '../components/Sound.jsx'

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

function RightBox({ text }) {
  const { t } = useI18n()
  return (
    <div className="right-box">
      <span className="label">{t('q.rightLabel')}</span>
      <p>
        {t(text)} <Speak text={t(text)} />
      </p>
    </div>
  )
}

export function InfoStep({ step, onNext, onBack }) {
  const { t } = useI18n()
  return (
    <>
      {step.img && <img className="illustration" src={step.img} alt="" />}
      <h1>
        {t(step.title)} <Speak text={`${t(step.title)}. ${t(step.text)}`} />
      </h1>
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
      <p>
        {text} <Speak text={text} />
      </p>
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
      <h1 className="statement">
        «{t(`${step.id}.q`)}» <Speak text={t(`${step.id}.q`)} />
      </h1>
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
      <h1 className="statement">
        «{t(`${step.id}.q`)}» <Speak text={t(`${step.id}.q`)} />
      </h1>
      <AnswerButtons options={['true', 'false', 'dontKnow']} value={value} onAnswer={onChange} />
      {value && (
        <div className="feedback" key={value}>
          <p className="reassure">
            {value === step.correct ? t('q.mythGotIt') : t('q.mythCommon')}{' '}
            <Speak text={value === step.correct ? t('q.mythGotIt') : t('q.mythCommon')} />
          </p>
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
      <h1>
        {t('ch2.chain.title')}{' '}
        <Speak text={[t('ch2.chain.title'), ...links.slice(0, shown).map((k) => t(k)), complete ? t('ch2.chain.text') : ''].join(' ')} />
      </h1>
      {/* Each link brings in its own figure (split from LFB's drawing), with an arrow between */}
      <ol className="chain">
        {links.slice(0, shown).map((k, i) => (
          <li key={k} className="chain-link">
            {i > 0 && (
              <span className="chain-arrow" aria-hidden="true">
                ↓
              </span>
            )}
            <span className="chain-row">
              <img src={img(`health-figure-${i + 1}.png`)} alt="" />
              <span>{t(k)}</span>
            </span>
          </li>
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
      <p className="lead">
        {t(step.text)} <Speak text={t(step.text)} />
      </p>
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

export function StoryStep({ step, answers, setAnswer, onNext, onBack, cameBack }) {
  const { t } = useI18n()
  const story = storyOf(step, answers)
  // Remember which stories have been read, for the "read the other one?" offer.
  const storyId = answers[step.storyFrom] ?? 'quiet'
  const finish = () => {
    const read = (answers._read ?? '').split(',').filter(Boolean)
    if (!read.includes(storyId)) setAnswer('_read', [...read, storyId].join(','))
    onNext()
  }
  const [i, setI] = useState(cameBack ? story.panels.length - 1 : 0)
  const panel = story.panels[i]
  const last = i === story.panels.length - 1

  return (
    <div className="story">
      <h1>
        {t(story.title)} <span className="story-sub">{t(story.sub)}</span>
      </h1>
      {/* keys restart the slow zoom and the text fade for each panel */}
      <div className="story-frame">
        <img key={panel.img} className="story-panel" src={panel.img} alt="" />
      </div>
      <p key={panel.text} className="story-text">
        {t(panel.text)} <Speak text={t(panel.text)} />
      </p>
      <StepNav onBack={i > 0 ? () => setI(i - 1) : onBack} onNext={last ? finish : () => setI(i + 1)} />
    </div>
  )
}

export function EmotionsStep({ step, answers, value, onChange, onNext, onBack }) {
  const { t } = useI18n()
  const name = t(storyOf(step, answers).name)
  const picked = value ? value.split(',') : []
  const toggle = (id) => {
    const nextPicked = picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id]
    onChange(nextPicked.join(','))
  }

  return (
    <>
      <h1>
        {t('story.emotions.title', { name })} <Speak text={`${t('story.emotions.title', { name })} ${t(`${step.id}.text`)}`} />
      </h1>
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

// Grid of actor cards with a check mark on picked ones. The badge sits at the
// bottom so it never covers the name painted at the top of the card.
function ActorGrid({ picked, onPick }) {
  const { t } = useI18n()
  return (
    <div className="card-grid">
      {ACTORS.map((a) => (
        <button key={a.id} className={`pick-card ${picked.includes(a.id) ? 'selected' : ''}`} aria-pressed={picked.includes(a.id)} onClick={() => onPick(a.id)}>
          <img src={a.img} alt={t(`actor.${a.id}`)} />
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

// "Who can {name} talk to?": pick as many as you like. Each pick shows how that
// helper could help in this story (or the card back's text). No wrong answers.
export function HelpersStep({ step, answers, value, onChange, onNext, onBack }) {
  const { t, has } = useI18n()
  const storyId = answers[step.storyFrom] ?? 'quiet'
  const name = t(storyOf(step, answers).name)
  const picked = value ? value.split(',') : []
  const toggle = (id) => onChange((picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id]).join(','))
  const why = (id) => (has(`story.${storyId}.why.${id}`) ? t(`story.${storyId}.why.${id}`) : t(`actor.${id}.what`))

  return (
    <>
      <h1>
        {t('story.helpers.title', { name })} <Speak text={`${t('story.helpers.title', { name })} ${t('story.helpers.text')}`} />
      </h1>
      <p className="lead">{t('story.helpers.text')}</p>
      <ActorGrid picked={picked} onPick={toggle} />
      {picked.length > 0 && (
        <div className="reasons">
          <h2>{t('story.helpers.why')}</h2>
          <ul>
            {picked.map((id) => {
              const actor = ACTORS.find((a) => a.id === id)
              return (
                <li key={id} className="reason">
                  <img src={actor.img} alt="" />
                  <span>
                    <strong>{t(`actor.${id}`)}</strong> {why(id)} <Speak text={`${t(`actor.${id}`)}. ${why(id)}`} />
                  </span>
                </li>
              )
            })}
          </ul>
          <p className="reassure">{t(`${step.id}.after`)}</p>
        </div>
      )}
      <StepNav onBack={onBack} onNext={onNext} nextLabel={picked.length ? undefined : t('common.skip')} />
    </>
  )
}

// After a story: offer to read the other one. Skips itself when both are read.
export function StoryAgainStep({ step, answers, setAnswer, onNext, onBack, onJumpTo, cameBack }) {
  const { t } = useI18n()
  const read = (answers._read ?? '').split(',').filter(Boolean)
  const other = Object.keys(STORIES).find((id) => !read.includes(id))

  useEffect(() => {
    if (other) return
    // Nothing to offer: pass through in the direction the reader is going.
    if (cameBack && onBack) onBack()
    else onNext()
  }, [])

  if (!other) return null
  const story = STORIES[other]
  return (
    <>
      <h1>
        {t('ch2.again.title')} <Speak text={`${t('ch2.again.title')} ${t('ch2.again.text', { title: t(story.title) })}`} />
      </h1>
      <p className="lead">{t('ch2.again.text', { title: t(story.title) })}</p>
      <img className="story-cover" src={story.cover} alt="" />
      <div className="actions">
        <button className="btn btn-secondary" onClick={onNext}>
          {t('ch2.again.no')}
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            setAnswer(step.storyFrom, other)
            onJumpTo('story')
          }}
        >
          {t('ch2.again.yes')}
        </button>
      </div>
      {onBack && (
        <button className="btn btn-link" onClick={onBack}>
          <span className="dir-arrow">←</span> {t('common.back')}
        </button>
      )}
    </>
  )
}

// "Who would you talk to first?": one personal choice.
export function FirstStep({ step, value, onChange, onNext, onBack }) {
  const { t } = useI18n()
  return (
    <>
      <h1>
        {t(`${step.id}.title`)} <Speak text={`${t(`${step.id}.title`)} ${t(`${step.id}.text`)}`} />
      </h1>
      <p className="lead">{t(`${step.id}.text`)}</p>
      <ActorGrid picked={value ? [value] : []} onPick={(id) => onChange(value === id ? null : id)} />
      {value && (
        <p className="reassure">
          {t(`${step.id}.after`)} <Speak text={t(`${step.id}.after`)} />
        </p>
      )}
      <StepNav onBack={onBack} onNext={onNext} nextLabel={value ? undefined : t('common.skip')} />
    </>
  )
}

export function ActivitiesStep({ step, value, onChange, onNext, onBack }) {
  const { t } = useI18n()
  const picked = value ? value.split(',') : []
  const toggle = (id) => onChange((picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id]).join(','))

  return (
    <>
      <h1>
        {t(`${step.id}.title`)} <Speak text={`${t(`${step.id}.title`)} ${ACTIVITIES.map((a) => t(`activity.${a.id}`)).join(', ')}`} />
      </h1>
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
      <h1>
        {t(step.title)} <Speak text={[t(step.title), ...step.items.map((k) => t(k))].join(' ')} />
      </h1>
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

// A list of situations; tapping one shows where to go for help.
export function RoutesStep({ step, onNext, onBack }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(null)
  return (
    <>
      <h1>
        {t(step.title)} <Speak text={[t(step.title), ...step.routes.map((r) => t(`${r}.q`))].join('. ')} />
      </h1>
      <p className="lead">{t('step.routes.hint')}</p>
      <ul className="routes">
        {step.routes.map((r) => (
          <li key={r} className={open === r ? 'open' : ''}>
            <button className="route-question" aria-expanded={open === r} onClick={() => setOpen(open === r ? null : r)}>
              <span>{t(`${r}.q`)}</span>
              <span aria-hidden="true">{open === r ? '−' : '+'}</span>
            </button>
            {open === r && (
              <p className="route-answer">
                {t(`${r}.a`)} <Speak text={t(`${r}.a`)} />
              </p>
            )}
          </li>
        ))}
      </ul>
      <StepNav onBack={onBack} onNext={onNext} />
    </>
  )
}

export function SummaryStep({ step, onNext, onBack }) {
  const { t } = useI18n()
  return (
    <>
      <h1>
        {t(step.title)} <Speak text={[t(step.title), ...step.items.map((k) => t(k))].join(' ')} />
      </h1>
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

export function CardStep({ step, onComplete, onExit, onGame }) {
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
      <Speak text={t(card.text)} />
      {step.offerGame && onGame && (
        <div className="game-offer">
          <p>{t('ch2.game.offer')}</p>
          <button className="btn btn-staff" onClick={onGame}>
            {t('game.start')}
          </button>
        </div>
      )}
      <StepNav onNext={onExit} nextLabel={t('common.toHub')} />
    </div>
  )
}
