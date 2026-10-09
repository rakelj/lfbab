import { useI18n } from '../i18n/I18n.jsx'
import { img } from '../content.js'
import { Speak } from '../components/Sound.jsx'

// PLACEHOLDER: LFB to confirm the social media handles. "@lfb" comes from the
// workshop deck and may be a placeholder.
const LINKS = [
  { label: 'about.website', text: 'barnevernsbarna.no', href: 'https://barnevernsbarna.no' },
  { label: 'about.email', text: 'post@barnevernsbarna.no', href: 'mailto:post@barnevernsbarna.no' },
  { label: null, name: 'Instagram', text: '@lfb [PLACEHOLDER]', href: 'https://www.instagram.com/lfb/' },
  { label: null, name: 'TikTok', text: '@lfb [PLACEHOLDER]', href: 'https://www.tiktok.com/@lfb' },
]

export default function About({ onBack }) {
  const { t } = useI18n()
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
        {t('about.contact')} <Speak text={[t('about.contact'), ...LINKS.map((l) => `${l.label ? t(l.label) : l.name}: ${l.text}`)].join('. ')} />
      </h2>
      <ul className="about-links">
        {LINKS.map((l) => (
          <li key={l.href}>
            {/* External links open outside the app and send no referrer */}
            <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
              <span className="about-link-label">{l.label ? t(l.label) : l.name}</span>
              <span>{l.text}</span>
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
