import { useState } from 'react'
import { useI18n } from '../i18n/I18n.jsx'
import Modal from './Modal.jsx'
import { Speak } from './Sound.jsx'
import { img } from '../content.js'

// Who to turn to. `calls` are phone numbers shown as "Ring <number>" buttons,
// `mail` an e-mail button, `extra` one more line of text; `urgent` sets the card
// apart. On a PC without a phone the number is still there to read.
const OPTIONS = [
  { key: 'staff', img: img('actor-centre-staff.jpg') },
  { key: 'rep', img: img('actor-representative.jpg') },
  { key: 'alarm', calls: ['116 111'], extra: 'help.alarm.interpreter', img: img('icon-phone.png') },
  { key: 'emergency', calls: ['113', '112'], urgent: true },
  { key: 'lfb', mail: 'post@barnevernsbarna.no', img: img('logo.png'), contain: true },
]

const say = (t, { key, extra }) => [`${t(`help.${key}.title`)}.`, t(`help.${key}.text`), extra && t(extra)].filter(Boolean).join(' ')

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
            <Speak text={[t('help.note'), t('help.intro'), ...OPTIONS.map((o) => say(t, o))].join(' ')} />
          </p>
          <ul className="help-list">
            {OPTIONS.map(({ key, calls, mail, extra, img: pic, urgent, contain }) => (
              <li key={key} className={urgent ? 'urgent' : ''}>
                <div>
                  {pic ? <img className={`help-pic ${contain ? 'contain' : ''}`} src={pic} alt="" /> : <span className="help-pic help-pic-urgent" aria-hidden="true">!</span>}
                  <span className="help-text">
                    <strong>{t(`help.${key}.title`)}</strong>
                    <span>{t(`help.${key}.text`)}</span>
                    {extra && <span className="help-extra">{t(extra)}</span>}
                    {(calls || mail) && (
                      <span className="help-actions">
                        {calls?.map((n) => (
                          <a key={n} className="help-action" href={`tel:${n.replace(/ /g, '')}`}>
                            <span aria-hidden="true">📞</span>{' '}
                            {/* the number stays left to right inside Arabic text */}
                            {t('help.call').split('{number}')[0]}
                            <bdi dir="ltr">{n}</bdi>
                            {t('help.call').split('{number}')[1]}
                          </a>
                        ))}
                        {mail && (
                          <a className="help-action" href={`mailto:${mail}`}>
                            <span aria-hidden="true">✉️</span> {t('help.email')}
                          </a>
                        )}
                      </span>
                    )}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </>
  )
}
