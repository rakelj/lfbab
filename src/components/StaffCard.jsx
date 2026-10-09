import { useState } from 'react'
import { useI18n } from '../i18n/I18n.jsx'
import Modal from './Modal.jsx'

// A sentence in Norwegian the kid can show to an adult at the centre.
// Pass `textKey` for a fixed sentence, or `text` for one built from Norwegian parts.
export default function StaffCard({ textKey, text }) {
  const { t, tStaff } = useI18n()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button className="btn btn-staff" onClick={() => setOpen(true)}>
        {t('staff.button')}
      </button>
      {open && (
        <Modal title={t('staff.title')} onClose={() => setOpen(false)} className="modal-staff">
          <p className="staff-text" lang="no" dir="ltr">
            {text ?? tStaff(textKey)}
          </p>
          <p className="muted">{t('staff.hint')}</p>
        </Modal>
      )}
    </>
  )
}
