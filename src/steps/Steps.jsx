import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/I18n.jsx'
import { ACTORS, EMOTIONS, RIGHTS_CARDS, img } from '../content.js'
import StaffCard from '../components/StaffCard.jsx'

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

// "True for you?": no right answer. Yes gets a nod; No / Don't know gets
// reassurance and a card to show staff.
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
          <p className="reassure">{value === 'yes' ? t('q.thanks') : t('q.notAlone')}</p>
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

export function StoryIntroStep({ step, onNext, onBack, onSkipTo }) {
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
      {onBack && (
        <button className="btn btn-link" onClick={onBack}>
          ← {t('common.back')}
        </button>
      )}
    </>
  )
}

export function StoryStep({ step, onNext, onBack, cameBack }) {
  const { t } = useI18n()
  const [i, setI] = useState(cameBack ? step.panels.length - 1 : 0)
  const panel = step.panels[i]
  const last = i === step.panels.length - 1

  return (
    <div className="story">
      <h1>{t(step.title)}</h1>
      <img className="story-panel" src={panel.img} alt="" />
      <p className="story-text">{t(panel.text)}</p>
      <StepNav onBack={i > 0 ? () => setI(i - 1) : onBack} onNext={last ? onNext : () => setI(i + 1)} />
    </div>
  )
}

export function EmotionsStep({ step, value, onChange, onNext, onBack }) {
  const { t } = useI18n()
  const picked = value ? value.split(',') : []
  const toggle = (id) => {
    const nextPicked = picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id]
    onChange(nextPicked.join(','))
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
      <StepNav onBack={onBack} onNext={onNext} nextLabel={picked.length ? undefined : t('common.skip')} />
    </>
  )
}

// Tap actors in the order you'd ask them; tap again to remove.
export function HelpersStep({ step, value, onChange, onNext, onBack }) {
  const { t } = useI18n()
  const order = value ? value.split('>') : []
  const toggle = (id) => {
    const nextOrder = order.includes(id) ? order.filter((x) => x !== id) : [...order, id]
    onChange(nextOrder.join('>'))
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
      <StepNav onBack={onBack} onNext={onNext} nextLabel={order.length ? undefined : t('common.skip')} />
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
      <div className="rights-card rights-card-new">
        <img src={card.img} alt="" />
        <p>{t(card.text)}</p>
      </div>
      <StepNav onNext={onExit} nextLabel={t('common.toHub')} />
    </div>
  )
}
