import { useI18n } from '../i18n/I18n.jsx'
import { CHAPTERS } from '../content.js'

export default function Hub({ progress, onOpen, onCards, onHelpers, onFinish, onRestart }) {
  const { t } = useI18n()

  const restart = () => {
    if (window.confirm(t('hub.restartConfirm'))) onRestart()
  }

  return (
    <section className="screen">
      <h1>{t('hub.title')}</h1>
      <p className="lead">{t('hub.text')}</p>
      <ul className="chapter-list">
        {CHAPTERS.map((ch, i) => {
          const done = progress.done.includes(ch.id)
          return (
            <li key={ch.id}>
              <button className={`chapter ${done ? 'done' : ''}`} disabled={ch.comingSoon} onClick={() => onOpen(ch.id)}>
                <img src={ch.img} alt="" />
                <span className="chapter-text">
                  <span className="chapter-number">{i + 1}</span>
                  <strong>{t(ch.title)}</strong>
                  <span>{t(ch.subtitle)}</span>
                </span>
                {done && <span className="badge badge-done">✓ {t('hub.done')}</span>}
                {ch.comingSoon && <span className="badge">{t('hub.soon')}</span>}
              </button>
            </li>
          )
        })}
      </ul>
      <div className="actions actions-stack">
        <button className="btn btn-secondary" onClick={onCards}>
          {t('hub.cards')} ({progress.cards.length})
        </button>
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
