import { useState } from 'react'
import { useI18n } from '../i18n/I18n.jsx'
import Dots from '../components/Dots.jsx'
import {
  InfoStep, SelfStep, MythStep, ChainStep, StoryChoiceStep, StoryStep, EmotionsStep, HelpersStep,
  ActivitiesStep, ActivitySummaryStep, RoutesStep, SummaryStep, CardStep, StoryAgainStep, FirstStep,
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
  storyAgain: StoryAgainStep,
  first: FirstStep,
  story: StoryStep,
  emotions: EmotionsStep,
  helpers: HelpersStep,
  summary: SummaryStep,
  card: CardStep,
}

export default function Chapter({ chapter, onComplete, onExit, onGame }) {
  const { t } = useI18n()
  // Visited step indexes, so Back returns to where you came from (also after a skip).
  const [history, setHistory] = useState([0])
  // Multi-part steps (story, chain) open at their end when you come back to them.
  const [cameBack, setCameBack] = useState(false)
  // Answers live in memory only while the chapter is open, so they can be
  // changed when going back. They are never stored or sent anywhere: LFB does
  // not collect any data. Keys starting with "_" are the chapter's own bookkeeping.
  const [answers, setAnswers] = useState({})

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
  // Jump to the first step of a type, e.g. back to the story to read the other one.
  const jumpTo = (type) => goTo(chapter.steps.findIndex((s) => s.type === type))
  const setAnswer = (key, value) => setAnswers((a) => ({ ...a, [key]: value }))
  // Steps after a story keep one answer per story ("ch2.emotions.shut").
  const answerKey = step.id && step.storyFrom ? `${step.id}.${answers[step.storyFrom] ?? 'quiet'}` : step.id

  return (
    <section className="screen">
      <div className="chapter-bar">
        <button className="btn btn-link" onClick={onExit}>
          <span className="dir-arrow">←</span> {t('common.toHub')}
        </button>
        <span className="chapter-name">{t(chapter.title)}</span>
      </div>
      <Dots count={chapter.steps.length} current={i} />
      {/* key resets the step's own UI state (e.g. story panel) when moving between steps */}
      <Step
        key={i}
        step={step}
        answers={answers}
        value={answerKey ? answers[answerKey] ?? null : null}
        onChange={(value) => setAnswer(answerKey, value)}
        setAnswer={setAnswer}
        onJumpTo={jumpTo}
        onGame={onGame}
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
