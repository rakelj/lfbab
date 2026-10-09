import { LANGUAGES } from '../i18n/languages.js'
import { img } from '../content.js'

export default function LanguageScreen({ onPick }) {
  return (
    <section className="screen screen-center">
      <img className="logo-large" src={img('logo.png')} alt="Landsforeningen for barnevernsbarn" />
      <h1 className="lang-title">
        {LANGUAGES.map((l) => (
          <span key={l.code} lang={l.code}>
            {l.choose}
          </span>
        ))}
      </h1>
      <ul className="lang-list">
        {LANGUAGES.map((l) => (
          <li key={l.code}>
            <button className="lang-option" lang={l.code} disabled={!l.available} onClick={() => onPick(l.code)}>
              <span className="lang-name">{l.name}</span>
              {!l.available && <span className="badge">{l.soon}</span>}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
