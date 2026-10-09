import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/I18n.jsx'
import { ACTORS } from '../content.js'
import Modal from './Modal.jsx'
import { Speak } from './Sound.jsx'

// The back of LFB's printed actor cards: who they are, what they help with, when to contact them.
function CardBack({ actor }) {
  const { t } = useI18n()
  return (
    <div className="actor-back">
      <h3>
        {t(`actor.${actor.id}`)}{' '}
        <Speak
          text={[t(`actor.${actor.id}`), t('actor.who'), t(`actor.${actor.id}.who`), t('actor.what'), t(`actor.${actor.id}.what`), t('actor.when'), t(`actor.${actor.id}.when`)].join('. ')}
        />
      </h3>
      <dl>
        <dt>{t('actor.who')}</dt>
        <dd>{t(`actor.${actor.id}.who`)}</dd>
        <dt>{t('actor.what')}</dt>
        <dd>{t(`actor.${actor.id}.what`)}</dd>
        <dt>{t('actor.when')}</dt>
        <dd>{t(`actor.${actor.id}.when`)}</dd>
      </dl>
    </div>
  )
}

// A card that turns over from the picture to the back text. Tap to turn it again.
function FlipCard({ actor, startFlipped = false }) {
  const { t } = useI18n()
  const [flipped, setFlipped] = useState(false)

  // Opened from an "i" button: show the front for a moment, then turn over.
  useEffect(() => {
    if (!startFlipped) return
    const id = setTimeout(() => setFlipped(true), 350)
    return () => clearTimeout(id)
  }, [startFlipped])

  return (
    <button className={`flip-card ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)} aria-pressed={flipped}>
      <span className="flip-inner">
        <span className="flip-front">
          <img src={actor.img} alt={t(`actor.${actor.id}`)} />
        </span>
        <span className="flip-back">
          <CardBack actor={actor} />
        </span>
      </span>
    </button>
  )
}

// On a rights card that shows a person card: opens it and turns it over.
export function CardBackButton({ card }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const actor = card.actor && ACTORS.find((a) => a.id === card.actor)
  if (!actor) return null
  return (
    <>
      <button className="btn btn-link card-back-button" onClick={() => setOpen(true)}>
        <span aria-hidden="true">↻</span> {t('card.back')}
      </button>
      {open && <ActorInfoModal actor={actor} onClose={() => setOpen(false)} />}
    </>
  )
}

export function ActorInfoModal({ actor, onClose }) {
  return (
    <Modal onClose={onClose} className="modal-card">
      <FlipCard actor={actor} startFlipped />
    </Modal>
  )
}
