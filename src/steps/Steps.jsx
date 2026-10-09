import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/I18n.jsx'
import { recordAnswer } from '../answers.js'
import { ACTORS, EMOTIONS, RIGHTS_CARDS, img } from '../content.js'
import StaffCard from '../components/StaffCard.jsx'

function NextButton({ onNext, disabled, label }) {
  const { t } = useI18n()
  return (
    <div className="actions">
      <button className="btn btn-primary" disabled={disabled} onClick={onNext}>
        {label ?? t('common.next')}
      </button>
    </div>
  )
}

function AnswerButtons({ options, value, onAnswer }) {
  const { t } = useI18n()
  return (
    <div className="answers">
      {options.map((o) => (
        <button
          key={o}
          className={`answer answer-${o} ${value === o ? 'selected' : ''}`}
          disabled={value !== null && value !== o}
          aria-pressed={value === o}
          onClick={() => onAnswer(o)}
        >
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

export function InfoStep({ step, onNext }) {
  const { t } = useI18n()
  return (
    <>
      {step.img && <img className="illustration" src={step.img} alt="" />}
      <h1>{t(step.title)}</h1>
      <p className="lead">{t(step.text)}</p>
      <NextButton onNext={onNext} />
    </>
  )
}

// "True for you?": no right answer. Yes gets a nod; No / Don't know gets
// reassurance and a card to show staff.
export function SelfStep({ step, onNext }) {
  const { t, lang } = useI18n()
  const [answer, setAnswer] = useState(null)

  const pick = (a) => {
    setAnswer(a)
    recordAnswer(step.id, a, lang)
  }

  return (
    <>
      {step.img && <img className="illustration illustration-small" src={step.img} alt="" />}
      <span className="label">{t('q.selfLabel')}</span>
      <h1 className="statement">«{t(`${step.id}.q`)}»</h1>
      <AnswerButtons options={['yes', 'no', 'dontKnow']} value={answer} onAnswer={pick} />
      {answer && (
        <div className="feedback">
          <p className="reassure">{answer === 'yes' ? t('q.thanks') : t('q.notAlone')}</p>
          <RightBox text={`${step.id}.right`} />
          {answer !== 'yes' && <StaffCard textKey={`${step.id}.staff`} />}
        </div>
      )}
      <NextButton onNext={onNext} label={answer ? undefined : t('common.skip')} />
    </>
  )
}

// "Did you know?": has a correct answer, but the feedback never says "wrong".
export function MythStep({ step, onNext }) {
  const { t, lang } = useI18n()
  const [answer, setAnswer] = useState(null)

  const pick = (a) => {
    setAnswer(a)
    recordAnswer(step.id, a, lang)
  }

  return (
    <>
      <span className="label">{t('q.mythLabel')}</span>
      <h1 className="statement">«{t(`${step.id}.q`)}»</h1>
      <AnswerButtons options={['true', 'false', 'dontKnow']} value={answer} onAnswer={pick} />
      {answer && (
        <div className="feedback">
          <p className="reassure">{answer === step.correct ? t('q.mythGotIt') : t('q.mythCommon')}</p>
          <RightBox text={`${step.id}.right`} />
        </div>
      )}
      <NextButton onNext={onNext} label={answer ? undefined : t('common.skip')} />
    </>
  )
}

// Body and mind: reveal the chain one link at a time.
export function ChainStep({ onNext }) {
  const { t } = useI18n()
  const [shown, setShown] = useState(1)
  const links = ['ch2.chain.1', 'ch2.chain.2', 'ch2.chain.3']
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
      <NextButton onNext={complete ? onNext : () => setShown(shown + 1)} />
    </>
  )
}

export function StoryIntroStep({ step, onNext, onSkipTo }) {
  const { t } = useI18n()
  return (
    <>
      <p className="lead">{t(step.text)}</p>
      <div className="actions">
        <button className="btn btn-secondary" onClick={() => onSkipTo(step.skipTo)}>
          {t('common.skip')}
        </button>
        <button className="btn btn-primary" onClick={onNext}>
          {t('ch2.story.read')}
        </button>
      </div>
    </>
  )
}

export function StoryStep({ step, onNext }) {
  const { t } = useI18n()
  const [i, setI] = useState(0)
  const panel = step.panels[i]
  const last = i === step.panels.length - 1

  return (
    <div className="story">
      <h1>{t(step.title)}</h1>
      <img className="story-panel" src={panel.img} alt="" />
      <p className="story-text">{t(panel.text)}</p>
      <div className="actions">
        {i > 0 && (
          <button className="btn btn-secondary" onClick={() => setI(i - 1)}>
            {t('common.back')}
          </button>
        )}
        <button className="btn btn-primary" onClick={last ? onNext : () => setI(i + 1)}>
          {t('common.next')}
        </button>
      </div>
    </div>
  )
}

export function EmotionsStep({ step, onNext }) {
  const { t, lang } = useI18n()
  const [picked, setPicked] = useState([])

  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  const done = () => {
    if (picked.length) recordAnswer(step.id, picked.join(','), lang)
    onNext()
  }

  return (
    <>
      <h1>{t(`${step.id}.title`)}</h1>
      <p className="lead">{t(`${step.id}.text`)}</p>
      <div className="card-grid">
        {EMOTIONS.map((e) => (
          <button key={e.id} className={`pick-card ${picked.includes(e.id) ? 'selected' : ''}`} aria-pressed={picked.includes(e.id)} onClick={() => toggle(e.id)}>
            <img src={e.img} alt={t(`emotion.${e.id}`)} />
          </button>
        ))}
      </div>
      {picked.length > 0 && <p className="reassure">{t(`${step.id}.after`)}</p>}
      <NextButton onNext={done} label={picked.length ? undefined : t('common.skip')} />
    </>
  )
}

// Tap actors in the order you'd ask them; tap again to remove.
export function HelpersStep({ step, onNext }) {
  const { t, lang } = useI18n()
  const [order, setOrder] = useState([])

  const toggle = (id) => setOrder((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]))
  const done = () => {
    if (order.length) recordAnswer(step.id, order.join('>'), lang)
    onNext()
  }

  return (
    <>
      <h1>{t(`${step.id}.title`)}</h1>
      <p className="lead">{t(`${step.id}.text`)}</p>
      <div className="card-grid">
        {ACTORS.map((a) => {
          const n = order.indexOf(a.id)
          return (
            <button key={a.id} className={`pick-card ${n >= 0 ? 'selected' : ''}`} aria-pressed={n >= 0} onClick={() => toggle(a.id)}>
              <img src={a.img} alt={t(`actor.${a.id}`)} />
              {n >= 0 && <span className="order-badge">{n + 1}</span>}
            </button>
          )
        })}
      </div>
      {order.length > 0 && <p className="reassure">{t(`${step.id}.after`)}</p>}
      <NextButton onNext={done} label={order.length ? undefined : t('common.skip')} />
    </>
  )
}

export function SummaryStep({ step, onNext }) {
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
      <NextButton onNext={onNext} />
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
      <div className="rights-card rights-card-new">
        <img src={card.img} alt="" />
        <p>{t(card.text)}</p>
      </div>
      <NextButton onNext={onExit} label={t('common.toHub')} />
    </div>
  )
}
