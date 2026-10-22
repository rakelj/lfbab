import { useI18n } from '../i18n/I18n.jsx'
import { chaptersFor } from '../content.js'
import { useFeatures } from '../features.jsx'
import { Speak } from '../components/Sound.jsx'

// The overview as a path: one station per chapter, with the next suggested
// one gently highlighted.
export default function Hub({ progress, onOpen, onHelpers, onFinish, onRestart }) {
  const { t } = useI18n()
  const { on, demo } = useFeatures()
  const chapters = chaptersFor(on)
  const nextId = chapters.find((ch) => !ch.comingSoon && !progress.done.includes(ch.id))?.id

  const restart = () => {
    if (window.confirm(t('hub.restartConfirm'))) onRestart()
  }

  return (
    <section className="screen">
      <h1>
        {t('hub.title')} <Speak text={[t('hub.title'), t('hub.text'), ...chapters.map((ch, i) => `${i + 1}. ${t(ch.title)}. ${t(ch.subtitle)}.`)].join(' ')} />
      </h1>
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
