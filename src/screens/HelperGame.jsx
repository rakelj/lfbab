import { useState } from 'react'
import { useI18n } from '../i18n/I18n.jsx'
import { ACTORS, SITUATIONS, img } from '../content.js'
import Dots from '../components/Dots.jsx'
import { Speak } from '../components/Sound.jsx'

const actor = (id) => ACTORS.find((a) => a.id === id)

// "Who can help?": one situation at a time, pick one or more cards, then see who
// can help most (with the "when to contact" text from the card back). Other
// picks are shown as "also good to talk to", never as wrong. No points.
// Picks are kept per situation (in memory only) so Back shows them again.
export default function HelperGame({ onBack }) {
  const { t } = useI18n()
  const [i, setI] = useState(0)
  const [rounds, setRounds] = useState({})
  const done = i >= SITUATIONS.length
  const s = SITUATIONS[i]
  const { picked = [], revealed = false } = rounds[i] ?? {}

  const update = (patch) => setRounds((r) => ({ ...r, [i]: { picked, revealed, ...patch } }))
  const toggle = (id) => !revealed && update({ picked: picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id] })
  const goTo = (n) => {
    setI(n)
    window.scrollTo({ top: 0 })
  }
  const restart = () => {
    setRounds({})
    goTo(0)
  }

  const exitBar = (
    <div className="chapter-bar">
      <button className="btn btn-link" onClick={onBack}>
        <span className="dir-arrow">←</span> {t('game.exit')}
      </button>
      <span className="chapter-name">{t('game.title')}</span>
    </div>
  )

  if (done) {
    return (
      <section className="screen">
        {exitBar}
        <div className="screen-center">
          <img className="illustration" src={img('friends.png')} alt="" />
          <h1>
            {t('game.done.title')} <Speak text={`${t('game.done.title')} ${t('game.done.text')}`} />
          </h1>
          <p className="lead">{t('game.done.text')}</p>
        </div>
        <div className="actions">
          <button className="btn btn-secondary" onClick={() => goTo(i - 1)}>
            {t('common.back')}
          </button>
          <button className="btn btn-secondary" onClick={restart}>
            {t('game.again')}
          </button>
          <button className="btn btn-primary" onClick={onBack}>
            {t('common.done')}
          </button>
        </div>
      </section>
    )
  }

  const also = picked.filter((id) => !s.best.includes(id))
  return (
    <section className="screen">
      {exitBar}
      <Dots count={SITUATIONS.length} current={i} />
      <span className="label">{t('game.counter', { n: i + 1, total: SITUATIONS.length })}</span>
      <div className="situation" key={s.id}>
        <p>
          «{t(`game.s.${s.id}`)}» <Speak text={`${t('game.counter', { n: i + 1, total: SITUATIONS.length })}. ${t(`game.s.${s.id}`)} ${revealed ? '' : t('game.intro')}`} />
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
          <h2>
            {t('game.best')}{' '}
            <Speak
              text={[t('game.best'), ...s.best.map((id) => `${t(`actor.${id}`)}. ${t(`actor.${id}.when`)}`), also.length ? `${t('game.also')} ${also.map((id) => t(`actor.${id}`)).join(', ')}` : ''].join(' ')}
            />
          </h2>
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
        {/* Back: un-reveal to change the picks, then to the previous situation, then out of the game */}
        <button className="btn btn-secondary" onClick={revealed ? () => update({ revealed: false }) : i > 0 ? () => goTo(i - 1) : onBack}>
          {t('common.back')}
        </button>
        {revealed ? (
          <button className="btn btn-primary" onClick={() => goTo(i + 1)}>
            {t('common.next')}
          </button>
        ) : (
          <button className="btn btn-primary" disabled={!picked.length} onClick={() => update({ revealed: true })}>
            {t('game.check')}
          </button>
        )}
      </div>
    </section>
  )
}
