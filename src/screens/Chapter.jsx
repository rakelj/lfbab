import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n/I18n.jsx'
import { recordAnswer } from '../answers.js'
import Dots from '../components/Dots.jsx'
import {
  InfoStep, SelfStep, MythStep, ChainStep, StoryChoiceStep, StoryStep, EmotionsStep, HelpersStep,
  ActivitiesStep, ActivitySummaryStep, RoutesStep, SummaryStep, CardStep,
} from '../steps/Steps.jsx'

const STEPS = {
  info: InfoStep,
  self: SelfStep,
  myth: MythStep,
  chain: ChainStep,
  storyChoice: StoryChoiceStep,
  activities: ActivitiesStep,
  activitySummary: ActivitySummaryStep,
  routes: RoutesStep,
  story: StoryStep,
  emotions: EmotionsStep,
  helpers: HelpersStep,
  summary: SummaryStep,
  card: CardStep,
}

export default function Chapter({ chapter, onComplete, onExit }) {
  const { t, lang } = useI18n()
  // Visited step indexes, so Back returns to where you came from (also after a skip).
  const [history, setHistory] = useState([0])
  // Multi-part steps (story, chain) open at their end when you come back to them.
  const [cameBack, setCameBack] = useState(false)
  // Answers live in memory only while the chapter is open, so they can be
  // changed when going back. Only the final answers are sent, when leaving.
  const [answers, setAnswers] = useState({})
  const answersRef = useRef(answers)
  answersRef.current = answers

  useEffect(() => {
    const flush = () => {
      for (const [question, answer] of Object.entries(answersRef.current)) {
        if (answer !== null && answer !== '') recordAnswer(question, answer, lang)
      }
      answersRef.current = {}
    }
    window.addEventListener('pagehide', flush)
    return () => {
      window.removeEventListener('pagehide', flush)
      flush()
    }
  }, [lang])

  const i = history[history.length - 1]
  const step = chapter.steps[i]
  const Step = STEPS[step.type]
  const isLast = i === chapter.steps.length - 1

  const goTo = (index) => {
    setHistory((h) => [...h, index])
    setCameBack(false)
    window.scrollTo({ top: 0 })
  }
  const next = () => (isLast ? onExit() : goTo(i + 1))
  const back =
    history.length > 1 && step.type !== 'card'
      ? () => {
          setHistory((h) => h.slice(0, -1))
          setCameBack(true)
          window.scrollTo({ top: 0 })
        }
      : null
  const skipTo = (type) => goTo(chapter.steps.findIndex((s, j) => j > i && s.type === type))

  return (
    <section className="screen">
      <div className="chapter-bar">
        <button className="btn btn-link" onClick={onExit}>
          ← {t('common.toHub')}
        </button>
        <span className="chapter-name">{t(chapter.title)}</span>
      </div>
      <Dots count={chapter.steps.length} current={i} />
      {/* key resets the step's own UI state (e.g. story panel) when moving between steps */}
      <Step
        key={i}
        step={step}
        answers={answers}
        value={step.id ? answers[step.id] ?? null : null}
        onChange={(value) => setAnswers((a) => ({ ...a, [step.id]: value }))}
        onNext={next}
        onBack={back}
        cameBack={cameBack}
        onSkipTo={skipTo}
        onComplete={() => onComplete(chapter.id, step.card)}
        onExit={onExit}
      />
    </section>
  )
}
