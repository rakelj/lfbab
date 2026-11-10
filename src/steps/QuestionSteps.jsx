import { useI18n } from '../i18n/I18n.jsx'
import StaffCard from '../components/StaffCard.jsx'
import { Speak } from '../components/Sound.jsx'
import { img } from '../content.js'
import { StepNav, AnswerButtons, RightBox, Validation } from './shared.jsx'

// The two question types: "True for you?" and "Did you know?".

// "True for you?": no right answer. Yes gets a nod; No / Don't know gets
// validation and a card to show staff.
export function SelfStep({ step, value, onChange, onNext, onBack }) {
  const { t, has } = useI18n()
  // "Don't know" has its own staff card where LFB has written one.
  const staff = value === 'dontKnow' && has(`${step.id}.staffDontKnow`) ? `${step.id}.staffDontKnow` : `${step.id}.staff`
  return (
    <>
      {step.img && <img className="illustration illustration-small" src={step.img} alt="" />}
      <span className="label">{t('q.selfLabel')}</span>
      <h1 className="statement">
        «{t(`${step.id}.q`)}» <Speak text={`${t('q.selfLabel')} ${t(`${step.id}.q`)}`} />
      </h1>
      <AnswerButtons options={['yes', 'no', 'dontKnow']} value={value} onAnswer={onChange} />
      {value && (
        <div className="feedback" key={value}>
          <Validation id={step.id} value={value} ok={value === 'yes'} fallback={value === 'yes' ? 'q.thanks' : 'q.notAlone'} />
          <RightBox text={`${step.id}.right`} />
          {value !== 'yes' && <StaffCard key={staff} textKey={staff} />}
        </div>
      )}
      <StepNav onBack={onBack} onNext={onNext} nextLabel={value ? undefined : t('common.skip')} />
    </>
  )
}

// "Did you know?": has a correct answer, but the feedback never says "wrong".
export function MythStep({ step, value, onChange, onNext, onBack }) {
  const { t, has } = useI18n()
  return (
    <>
      <span className="label">{t('q.mythLabel')}</span>
      <h1 className="statement">
        «{t(`${step.id}.q`)}» <Speak text={`${t('q.mythLabel')} ${t(`${step.id}.q`)}`} />
      </h1>
      <AnswerButtons options={['true', 'false', 'dontKnow']} value={value} onAnswer={onChange} />
      {value && (
        <div className="feedback" key={value}>
          <Validation id={step.id} value={value} ok={value === step.correct} fallback={value === step.correct ? 'q.mythGotIt' : 'q.mythCommon'} />
          <RightBox text={`${step.id}.right`} />
          {/* Some statements also have a card to show staff, whatever the answer */}
          {has(`${step.id}.staff`) && <StaffCard textKey={`${step.id}.staff`} />}
        </div>
      )}
      <StepNav onBack={onBack} onNext={onNext} nextLabel={value ? undefined : t('common.skip')} />
    </>
  )
}
