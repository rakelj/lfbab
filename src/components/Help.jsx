import { useState } from 'react'
import { useI18n } from '../i18n/I18n.jsx'
import Modal from './Modal.jsx'
import { Speak } from './Sound.jsx'
import { img } from '../content.js'

// Who to turn to. `href` makes the card call or e-mail; `urgent` sets it apart.
const OPTIONS = [
  { key: 'staff', img: img('actor-centre-staff.jpg') },
  { key: 'rep', img: img('actor-representative.jpg') },
  { key: 'alarm', href: 'tel:116111', img: img('icon-phone.png') },
  { key: 'emergency', href: 'tel:113', urgent: true },
  { key: 'lfb', href: 'mailto:post@barnevernsbarna.no', img: img('logo.png'), contain: true },
]

export default function HelpButton() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button className="help-button" onClick={() => setOpen(true)}>
        {t('help.button')}
      </button>
      {open && (
        <Modal title={t('help.title')} onClose={() => setOpen(false)}>
          {/* The most important message first: asking for help is safe */}
          <p className="help-safe">
            <span className="help-safe-mark" aria-hidden="true">
              ✓
            </span>
            {t('help.note')}
          </p>
          <p>
            {t('help.intro')}{' '}
            <Speak text={[t('help.note'), t('help.intro'), ...OPTIONS.map(({ key }) => `${t(`help.${key}.title`)}. ${t(`help.${key}.text`)}`)].join(' ')} />
          </p>
          <ul className="help-list">
            {OPTIONS.map(({ key, href, img: pic, urgent, contain }) => {
              const body = (
                <>
                  {pic ? <img className={`help-pic ${contain ? 'contain' : ''}`} src={pic} alt="" /> : <span className="help-pic help-pic-urgent" aria-hidden="true">!</span>}
                  <span className="help-text">
                    <strong>{t(`help.${key}.title`)}</strong>
                    <span>{t(`help.${key}.text`)}</span>
                  </span>
                  {href && (
                    <span className="help-go dir-arrow" aria-hidden="true">
                      →
                    </span>
                  )}
                </>
              )
              return (
                <li key={key} className={urgent ? 'urgent' : ''}>
                  {href ? <a href={href}>{body}</a> : <div>{body}</div>}
                </li>
              )
            })}
          </ul>
        </Modal>
      )}
    </>
  )
}
