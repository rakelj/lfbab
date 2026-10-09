import { useState } from 'react'
import { useI18n } from '../i18n/I18n.jsx'
import { ACTORS, SITUATIONS, img } from '../content.js'
import Dots from '../components/Dots.jsx'
import { Speak } from '../components/Sound.jsx'

const actor = (id) => ACTORS.find((a) => a.id === id)

// "Who can help?": one situation at a time, pick one or more cards, then see who
// can help most (with the "when to contact" text from the card back). Other
// picks are shown as "also good to talk to", never as wrong. No points.
export default function HelperGame({ onBack }) {
  const { t } = useI18n()
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState([])
  const [revealed, setRevealed] = useState(false)
  const done = i >= SITUATIONS.length
  const s = SITUATIONS[i]

  const toggle = (id) => !revealed && setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  const reveal = () => {
    setRevealed(true)
  }
  const next = () => {
    setI(i + 1)
    setPicked([])
    setRevealed(false)
    window.scrollTo({ top: 0 })
  }
  const restart = () => {
    setI(0)
    setPicked([])
    setRevealed(false)
  }

  if (done) {
    return (
      <section className="screen screen-center">
        <img className="illustration" src={img('friends.png')} alt="" />
        <h1>{t('game.done.title')}</h1>
        <p className="lead">{t('game.done.text')}</p>
        <div className="actions">
          <button className="btn btn-secondary" onClick={restart}>
            {t('game.again')}
          </button>
          <button className="btn btn-primary" onClick={onBack}>
            {t('common.back')}
          </button>
        </div>
      </section>
    )
  }

  const also = picked.filter((id) => !s.best.includes(id))
  return (
    <section className="screen">
      <div className="chapter-bar">
        <button className="btn btn-link" onClick={onBack}>
          <span className="dir-arrow">←</span> {t('common.back')}
        </button>
        <span className="chapter-name">{t('game.title')}</span>
      </div>
      <Dots count={SITUATIONS.length} current={i} />
      <span className="label">{t('game.counter', { n: i + 1, total: SITUATIONS.length })}</span>
      <div className="situation" key={s.id}>
        <p>
          «{t(`game.s.${s.id}`)}» <Speak text={t(`game.s.${s.id}`)} />
        </p>
      </div>
      {!revealed && <p className="muted">{t('game.intro')}</p>}
      <div className="game-grid">
        {s.options.map((id) => {
          const best = revealed && s.best.includes(id)
          const chosen = picked.includes(id)
          return (
            <button
              key={id}
              className={`pick-card ${chosen ? 'selected' : ''} ${best ? 'best' : ''} ${revealed && !best ? 'dim' : ''}`}
              aria-pressed={chosen}
              onClick={() => toggle(id)}
            >
              <img src={actor(id).img} alt={t(`actor.${id}`)} />
              {best && (
                <span className="check-badge best-badge" aria-hidden="true">
                  ★
                </span>
              )}
            </button>
          )
        })}
      </div>

      {revealed && (
        <div className="reasons">
          <h2>{t('game.best')}</h2>
          <ul>
            {s.best.map((id) => (
              <li key={id} className="reason">
                <img src={actor(id).img} alt="" />
                <span>
                  <strong>{t(`actor.${id}`)}</strong> {t(`actor.${id}.when`)} <Speak text={`${t(`actor.${id}`)}. ${t(`actor.${id}.when`)}`} />
                </span>
              </li>
            ))}
          </ul>
          {also.length > 0 && (
            <p className="muted">
              {t('game.also')} {also.map((id) => t(`actor.${id}`)).join(', ')}
            </p>
          )}
        </div>
      )}

      <div className="actions">
        {revealed ? (
          <button className="btn btn-primary" onClick={next}>
            {t('common.next')}
          </button>
        ) : (
          <button className="btn btn-primary" disabled={!picked.length} onClick={reveal}>
            {t('game.check')}
          </button>
        )}
      </div>
    </section>
  )
}
