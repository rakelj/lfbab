import { useState } from 'react'
import { useI18n } from '../i18n/I18n.jsx'
import StaffCard from '../components/StaffCard.jsx'
import { Speak } from '../components/Sound.jsx'
import { img } from '../content.js'
import { StepNav } from './shared.jsx'

// Steps that mostly show text: info, summaries, where to get help, and the rights screen that ends every topic.

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
      {step.note && (
        <p className="reassure">
          {t(step.note)} <Speak text={t(step.note)} />
        </p>
      )}
      {step.staff && <StaffCard textKey={step.staff} />}
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
        {t(step.title)} <Speak text={[t(step.title), t('step.routes.hint'), ...step.routes.map((r) => t(`${r}.q`))].join('. ')} />
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

// Last screen of every chapter: what you have a right to, and your duties
// where they apply. All chapters use the same picture.
export function RightsStep({ step, onNext, onBack, onGame, isLast }) {
  const { t } = useI18n()
  const { duties } = step
  return (
    <>
      <img className="illustration" src={img('rights-placeholder.svg')} alt="" />
      <h1>
        {t(step.title)} <Speak text={[t(step.title), ...step.items.map((k) => t(k))].join(' ')} />
      </h1>
      <ul className="summary">
        {step.items.map((k) => (
          <li key={k}>{t(k)}</li>
        ))}
      </ul>
      {step.note && (
        <p className="reassure">
          {t(step.note)} <Speak text={t(step.note)} />
        </p>
      )}
      {duties && (
        <>
          <h2>
            {t(duties.title)} <Speak text={[t(duties.title), ...duties.items.map((k) => t(k))].join(' ')} />
          </h2>
          <ul className="summary">
            {duties.items.map((k) => (
              <li key={k}>{t(k)}</li>
            ))}
          </ul>
        </>
      )}
      {step.staff && <StaffCard textKey={step.staff} />}
      {step.offerGame && onGame && (
        <div className="game-offer">
          <p>
            {t('ch2.game.offer')} <Speak text={t('ch2.game.offer')} />
          </p>
          <button className="btn btn-staff" onClick={onGame}>
            {t('game.start')}
          </button>
        </div>
      )}
      <StepNav onBack={onBack} onNext={onNext} nextLabel={isLast ? t('common.toHub') : undefined} />
    </>
  )
}
