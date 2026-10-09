import { useI18n } from '../i18n/I18n.jsx'
import { getLanguage } from '../i18n/languages.js'

// Always-visible way back to the language screen, showing the current language.
export default function LanguageButton({ onClick }) {
  const { t, lang } = useI18n()
  return (
    <button className="lang-button" onClick={onClick} aria-label={t('lang.button')}>
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
      </svg>
      <span>{getLanguage(lang).name}</span>
    </button>
  )
}
