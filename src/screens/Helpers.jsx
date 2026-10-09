import { useState } from 'react'
import { useI18n } from '../i18n/I18n.jsx'
import { ACTORS } from '../content.js'
import { ActorInfoModal } from '../components/ActorCard.jsx'

// Gallery of LFB's actor cards. Tapping one opens it large and turns it over.
export default function Helpers({ onBack, onGame }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(null)

  return (
    <section className="screen">
      <h1>{t('helpers.title')}</h1>
      <p className="lead">{t('helpers.text')}</p>
      <button className="btn btn-staff game-button" onClick={onGame}>
        {t('game.start')}
      </button>
      <div className="card-grid">
        {ACTORS.map((a) => (
          <button key={a.id} className="pick-card" onClick={() => setOpen(a)}>
            <img src={a.img} alt={t(`actor.${a.id}`)} />
          </button>
        ))}
      </div>
      {open && <ActorInfoModal actor={open} onClose={() => setOpen(null)} />}
      <div className="actions">
        <button className="btn btn-primary" onClick={onBack}>
          {t('common.toHub')}
        </button>
      </div>
    </section>
  )
}
