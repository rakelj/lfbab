import { useI18n } from '../i18n/I18n.jsx'
import { img } from '../content.js'
import { Speak } from '../components/Sound.jsx'

// The addresses live in the text sheet (about.*.value), so LFB can change
// them. A link whose value is left empty is not shown. The first word is used
// for the link, so a note such as "[PLACEHOLDER]" after it does no harm.
const LINKS = [
  { label: 'about.website', value: 'about.website.value', href: (v) => `https://${v}` },
  { label: 'about.email', value: 'about.email.value', href: (v) => `mailto:${v}` },
  { label: 'about.instagram', value: 'about.instagram.value', href: (v) => `https://www.instagram.com/${v.replace(/^@/, '')}/` },
  { label: 'about.facebook', value: 'about.facebook.value', href: (v) => `https://www.facebook.com/${v.replace(/^@/, '')}` },
]

export default function About({ onBack }) {
  const { t } = useI18n()
  const links = LINKS.map((l) => ({ label: t(l.label), text: t(l.value), make: l.href, key: l.value }))
    .filter((l) => l.text && l.text !== l.key)
    .map((l) => ({ ...l, href: l.make(l.text.split(/\s/)[0]) }))
  return (
    <section className="screen">
      <img className="logo-about" src={img('logo.png')} alt="Landsforeningen for barnevernsbarn" />
      <h1>
        {t('about.title')} <Speak text={[t('about.title'), t('about.madeBy'), t('about.text'), t('about.lfb'), t('about.privacy')].join(' ')} />
      </h1>
      <p className="lead">
        <strong>{t('about.madeBy')}</strong>
      </p>
      <p>{t('about.text')}</p>
      <p>{t('about.lfb')}</p>
      <p className="reassure">{t('about.privacy')}</p>

      <h2>
        {t('about.contact')} <Speak text={[t('about.contact'), ...links.map((l) => `${l.label}: ${l.text}`)].join('. ')} />
      </h2>
      <ul className="about-links">
        {links.map((l) => (
          <li key={l.key}>
            {/* External links open outside the app and send no referrer */}
            <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
              <span className="about-link-label">{l.label}</span>
              {/* addresses read left to right, also in Arabic */}
              <bdi dir="ltr">{l.text}</bdi>
            </a>
          </li>
        ))}
      </ul>

      <h2>
        {t('about.credits')} <Speak text={`${t('about.credits')}. ${t('about.illustrations')}. ${t('about.development')}`} />
      </h2>
      <p className="muted">
        {t('about.illustrations')}
        <br />
        {t('about.development')}
      </p>

      <div className="actions">
        <button className="btn btn-primary" onClick={onBack}>
          {t('common.back')}
        </button>
      </div>
    </section>
  )
}
