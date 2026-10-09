import { useState } from 'react'
import { useI18n } from '../i18n/I18n.jsx'
import Dots from '../components/Dots.jsx'
import { InfoStep, SelfStep, MythStep, ChainStep, StoryIntroStep, StoryStep, EmotionsStep, HelpersStep, SummaryStep, CardStep } from '../steps/Steps.jsx'

const STEPS = {
  info: InfoStep,
  self: SelfStep,
  myth: MythStep,
  chain: ChainStep,
  storyIntro: StoryIntroStep,
  story: StoryStep,
  emotions: EmotionsStep,
  helpers: HelpersStep,
  summary: SummaryStep,
  card: CardStep,
}

export default function Chapter({ chapter, onComplete, onExit }) {
  const { t } = useI18n()
  const [i, setI] = useState(0)
  const step = chapter.steps[i]
  const Step = STEPS[step.type]

  const next = () => (i < chapter.steps.length - 1 ? setI(i + 1) : onExit())
  const skipTo = (type) => setI(chapter.steps.findIndex((s, j) => j > i && s.type === type))
  const scrollTop = () => window.scrollTo({ top: 0 })

  return (
    <section className="screen">
      <div className="chapter-bar">
        <button className="btn btn-link" onClick={onExit}>
          ← {t('common.toHub')}
        </button>
        <span className="chapter-name">{t(chapter.title)}</span>
      </div>
      <Dots count={chapter.steps.length} current={i} />
      {/* key resets each step's local state when moving on */}
      <Step
        key={i}
        step={step}
        onNext={() => {
          next()
          scrollTop()
        }}
        onSkipTo={skipTo}
        onComplete={() => onComplete(chapter.id, step.card)}
        onExit={onExit}
      />
    </section>
  )
}
