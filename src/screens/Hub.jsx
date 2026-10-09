import { useI18n } from '../i18n/I18n.jsx'
import { RIGHTS_CARDS, cardOf, chaptersFor } from '../content.js'
import { useFeatures } from '../features.jsx'

// The overview as a path: one station per chapter, with the next suggested
// one gently highlighted, and a row of card slots that fill up as you go.
export default function Hub({ progress, onOpen, onCards, onHelpers, onFinish, onRestart }) {
  const { t } = useI18n()
  const { on, demo } = useFeatures()
  const chapters = chaptersFor(on)
  const nextId = chapters.find((ch) => !ch.comingSoon && !progress.done.includes(ch.id))?.id
  // One slot per visible chapter; collected cards count only if their chapter is shown.
  const cardIds = chapters.map(cardOf).filter(Boolean)
  const collected = progress.cards.filter((id) => cardIds.includes(id))

  const restart = () => {
    if (window.confirm(t('hub.restartConfirm'))) onRestart()
  }

  return (
    <section className="screen">
      <h1>{t('hub.title')}</h1>
      <p className="lead">{t('hub.text')}</p>

      <ol className="path">
        {chapters.map((ch, i) => {
          const done = progress.done.includes(ch.id)
          const state = ch.comingSoon ? 'soon' : done ? 'done' : ch.id === nextId ? 'next' : ''
          return (
            <li key={ch.id} className={`station ${state}`}>
              <button className="station-button" disabled={ch.comingSoon} onClick={() => onOpen(ch.id)}>
                <span className={`station-dot ${ch.imgContain ? 'contain' : ''}`}>
                  <img src={ch.img} alt="" />
                  {done && <span className="station-check" aria-hidden="true">✓</span>}
                </span>
                <span className="station-text">
                  <span className="chapter-number">{i + 1}</span>
                  <strong>{t(ch.title)}</strong>
                  <span>{t(ch.subtitle)}</span>
                  {done && <span className="badge badge-done">{t('hub.done')}</span>}
                  {ch.comingSoon && <span className="badge">{t('hub.soon')}</span>}
                  {demo && ch.extra && <span className="badge badge-extra">{t('x.badge')}</span>}
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      <button className="card-slots" onClick={onCards} aria-label={`${t('hub.cards')} (${collected.length}/${cardIds.length})`}>
        <span className="card-slots-title">
          {t('hub.cards')} <span className="muted">{collected.length}/{cardIds.length}</span>
        </span>
        <span className="card-slots-row">
          {cardIds.map((id) =>
            progress.cards.includes(id) ? (
              <span key={id} className={`slot filled ${RIGHTS_CARDS[id].cutout ? 'cutout' : ''}`}>
                <img src={RIGHTS_CARDS[id].img} alt="" />
              </span>
            ) : (
              <span key={id} className="slot empty" aria-hidden="true">
                ?
              </span>
            ),
          )}
        </span>
      </button>

      <div className="actions actions-stack">
        <button className="btn btn-secondary" onClick={onHelpers}>
          {t('hub.helpers')}
        </button>
        <button className="btn btn-primary" onClick={onFinish}>
          {t('hub.finish')}
        </button>
        <button className="btn btn-link" onClick={restart}>
          {t('hub.restart')}
        </button>
      </div>
    </section>
  )
}
