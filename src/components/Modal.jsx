import { useEffect } from 'react'
import { useI18n } from '../i18n/I18n.jsx'

export default function Modal({ title, onClose, className = '', children }) {
  const { t } = useI18n()

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal ${className}`} role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        {title && <h2>{title}</h2>}
        {children}
        <button className="btn btn-secondary" onClick={onClose} autoFocus>
          {t('common.close')}
        </button>
      </div>
    </div>
  )
}
