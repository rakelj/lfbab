import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/I18n.jsx'
import { Speak } from '../components/Sound.jsx'
import { ACTORS, EMOTIONS, STORIES, img } from '../content.js'
import CardName, { useCardNames } from '../components/CardName.jsx'
import { useBack, PAGE } from '../nav.js'
import { StepNav, ActorGrid, storyOf } from './shared.jsx'

// The stories about Hamlin and Elias, and the questions after them.

// Content note, then pick one of the stories, or skip them.
export function StoryChoiceStep({ step, value, onChange, onNext, onBack, onSkipTo }) {
  const { t } = useI18n()
  return (
    <>
      <p className="lead">
        {t(step.text)} <Speak text={[t(step.text), ...Object.values(STORIES).map((s) => t(s.title))].join(' ')} />
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
  useBack(PAGE, () => (setI(i - 1), true), i > 0)
  const last = i === story.panels.length - 1

  return (
    <div className="story">
      <h1>
        {t(story.title)} <span className="story-sub">{t(story.sub)}</span> <Speak text={`${t(story.title)}. ${t(story.sub)}`} />
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
  const emotionNames = useCardNames(EMOTIONS.map((e) => `emotion.${e.id}`), { overlay: true })
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
        {t('story.emotions.title', { name })} <Speak text={`${t('story.emotions.title', { name })} ${t(`${step.id}.text`)} ${emotionNames}`} />
      </h1>
      <p className="lead">{t(`${step.id}.text`)}</p>
      <div className="card-grid">
        {EMOTIONS.map((e) => (
          <button key={e.id} className={`pick-card ${picked.includes(e.id) ? 'selected' : ''}`} aria-pressed={picked.includes(e.id)} onClick={() => toggle(e.id)}>
            <img src={e.img} alt={t(`emotion.${e.id}`)} />
            <CardName text={t(`emotion.${e.id}`)} overlay bottom />
          </button>
        ))}
      </div>
      {picked.length > 0 && (
        <p className="reassure">
          {t('story.emotions.after', { name })} <Speak text={t('story.emotions.after', { name })} />
        </p>
      )}
      <StepNav onBack={onBack} onNext={onNext} nextLabel={picked.length ? undefined : t('common.skip')} />
    </>
  )
}

// "Who can {name} talk to?": pick as many as you like. Each pick shows how that
// helper could help in this story (or the card back's text). No wrong answers.
export function HelpersStep({ step, answers, value, onChange, onNext, onBack }) {
  const actorNames = useCardNames(ACTORS.map((a) => `actor.${a.id}`), { overlay: true })
  const { t, has } = useI18n()
  const storyId = answers[step.storyFrom] ?? 'quiet'
  const name = t(storyOf(step, answers).name)
  const picked = value ? value.split(',') : []
  const toggle = (id) => onChange((picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id]).join(','))
  const why = (id) => (has(`story.${storyId}.why.${id}`) ? t(`story.${storyId}.why.${id}`) : t(`actor.${id}.what`))

  return (
    <>
      <h1>
        {t('story.helpers.title', { name })} <Speak text={`${t('story.helpers.title', { name })} ${t('story.helpers.text')} ${actorNames}`} />
      </h1>
      <p className="lead">{t('story.helpers.text')}</p>
      <ActorGrid picked={picked} onPick={toggle} />
      {picked.length > 0 && (
        <div className="reasons">
          <h2>
            {t('story.helpers.why')} <Speak text={[t('story.helpers.why'), ...picked.map((id) => `${t(`actor.${id}`)}. ${why(id)}`)].join(' ')} />
          </h2>
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
          <p className="reassure">
            {t(`${step.id}.after`, { name })} <Speak text={t(`${step.id}.after`, { name })} />
          </p>
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
