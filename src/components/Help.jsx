import { useState } from 'react'
import { useI18n } from '../i18n/I18n.jsx'
import Modal from './Modal.jsx'
import { Speak } from './Sound.jsx'

const OPTIONS = [
  { key: 'staff' },
  { key: 'alarm', href: 'tel:116111' },
  { key: 'emergency', href: 'tel:113' },
  { key: 'lfb', href: 'mailto:post@barnevernsbarna.no' },
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
          <p>
            {t('help.intro')}{' '}
            <Speak text={[t('help.intro'), ...OPTIONS.map(({ key }) => `${t(`help.${key}.title`)}. ${t(`help.${key}.text`)}`), t('help.note')].join(' ')} />
          </p>
          <ul className="help-list">
            {OPTIONS.map(({ key, href }) => {
              const body = (
                <>
                  <strong>{t(`help.${key}.title`)}</strong>
                  <span>{t(`help.${key}.text`)}</span>
                </>
              )
              return <li key={key}>{href ? <a href={href}>{body}</a> : <div>{body}</div>}</li>
            })}
          </ul>
          <p className="reassure">{t('help.note')}</p>
        </Modal>
      )}
    </>
  )
}
