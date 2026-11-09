import { useI18n } from '../i18n/I18n.jsx'
import StaffCard from '../components/StaffCard.jsx'
import { Speak } from '../components/Sound.jsx'
import { ACTIVITIES, img } from '../content.js'
import { StepNav } from './shared.jsx'

// What do you like to do? Picking activities, and "Veien videre".

export function ActivitiesStep({ step, value, onChange, onNext, onBack }) {
  const { t } = useI18n()
  const picked = value ? value.split(',') : []
  const toggle = (id) => onChange((picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id]).join(','))

  return (
    <>
      <h1>
        {t(`${step.id}.title`)} <Speak text={`${t(`${step.id}.title`)} ${t(`${step.id}.text`)} ${ACTIVITIES.map((a) => t(`activity.${a.id}`)).join(', ')}`} />
      </h1>
      <p className="lead">{t(`${step.id}.text`)}</p>
      <div className="activity-grid">
        {ACTIVITIES.map((a) => (
          <button key={a.id} className={`activity-card ${picked.includes(a.id) ? 'selected' : ''}`} aria-pressed={picked.includes(a.id)} onClick={() => toggle(a.id)}>
            <span className={`activity-img ${a.cutout ? 'cutout' : ''} ${a.question ? 'question' : ''}`}>
              {a.question ? <span aria-hidden="true">?</span> : <img src={a.img} alt="" />}
            </span>
            <span className="activity-label">{t(`activity.${a.id}`)}</span>
          </button>
        ))}
      </div>
      {picked.length > 0 && (
        <p className="reassure">
          {t(`${step.id}.after`)} <Speak text={t(`${step.id}.after`)} />
        </p>
      )}
      <StepNav onBack={onBack} onNext={onNext} nextLabel={picked.length ? undefined : t('common.skip')} />
    </>
  )
}

// "Veien videre" for the activities chapter: an encouraging line for each
// activity picked, the note that not everything exists everywhere, the
// summary, and a staff card that names the activities picked.
export function ActivitySummaryStep({ step, answers, onNext, onBack }) {
  const { t, tStaff } = useI18n()
  const picked = answers[step.activitiesFrom] ? answers[step.activitiesFrom].split(',') : []
  const lines = (picked.length ? picked : ['other']).map((id) => t(`ch3.next.${id}`))
  const phrases = picked.map((id) => tStaff(`activity.${id}.staff`))
  const list = phrases.length > 1 ? `${phrases.slice(0, -1).join(', ')} ${tStaff('ch3.staff.and')} ${phrases.at(-1)}` : phrases[0]
  const staffText = list ? `${tStaff('ch3.staff.start')} ${list}. ${tStaff('ch3.staff.end')}` : tStaff('ch3.staff.none')

  return (
    <>
      <h1>
        {t(step.nextTitle)} <Speak text={[t(step.nextTitle), ...lines].join(' ')} />
      </h1>
      {lines.map((line) => (
        <p key={line} className="lead">{line}</p>
      ))}
      <p className="note">
        {t(step.disclaimer)} <Speak text={t(step.disclaimer)} />
      </p>
      <h2>
        {t(step.title)} <Speak text={[t(step.title), ...step.items.map((k) => t(k))].join(' ')} />
      </h2>
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
