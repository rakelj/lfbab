import { useI18n } from '../i18n/I18n.jsx'

export default function Footer({ onAbout }) {
  const { t } = useI18n()
  return (
    <footer className="site-footer">
      <span>{t('footer.madeBy')}</span>
      <span aria-hidden="true">·</span>
      <button className="btn-link footer-link" onClick={onAbout}>
        {t('footer.about')}
      </button>
    </footer>
  )
}
