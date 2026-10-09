import { useState } from 'react'
import { useI18n } from '../i18n/I18n.jsx'
import { FEATURES, useFeatures } from '../features.jsx'
import Modal from './Modal.jsx'

// Demo mode only: switch parts of the app on and off to try versions with LFB.
export default function DemoSettings() {
  const { t } = useI18n()
  const { on, set, reset } = useFeatures()
  const [open, setOpen] = useState(false)

  const group = (name) => (
    <fieldset className="settings-group">
      <legend>{t(`settings.${name}`)}</legend>
      {FEATURES.filter((f) => f.group === name).map((f) => (
        <label key={f.id} className="settings-row">
          <input type="checkbox" checked={on(f.id)} onChange={(e) => set(f.id, e.target.checked)} />
          <span>{f.label}</span>
        </label>
      ))}
    </fieldset>
  )

  return (
    <>
      <button className="demo-settings-button" onClick={() => setOpen(true)} aria-label={t('settings.title')}>
        ⚙
      </button>
      {open && (
        <Modal title={t('settings.title')} onClose={() => setOpen(false)}>
          {group('flow')}
          {group('extra')}
          <p className="muted">{t('settings.note')}</p>
          <button className="btn btn-link" onClick={reset}>
            {t('settings.reset')}
          </button>
        </Modal>
      )}
    </>
  )
}
