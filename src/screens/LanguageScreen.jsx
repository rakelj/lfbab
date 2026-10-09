import { useEffect, useState } from 'react'
import { LANGUAGES, isSelectable } from '../i18n/languages.js'
import { useFeatures } from '../features.jsx'
import { img } from '../content.js'

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// A speech bubble that greets in each language in turn, with "choose language"
// in the same language. The list below can be used right away.
function GreetingBubble() {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (reducedMotion()) return
    const id = setInterval(() => setI((n) => (n + 1) % LANGUAGES.length), 2200)
    return () => clearInterval(id)
  }, [])

  const l = LANGUAGES[i]
  return (
    <div className="greeting" aria-hidden="true">
      <div className="greeting-bubble" key={l.code} lang={l.code} dir={l.dir}>
        <span className="greeting-hello">{l.hello}</span>
        <span className="greeting-choose">{l.choose}</span>
      </div>
    </div>
  )
}

export default function LanguageScreen({ onPick }) {
  const { demo } = useFeatures()
  return (
    <section className="screen screen-center">
      <img className="logo-small" src={img('logo.png')} alt="Landsforeningen for barnevernsbarn" />
      <GreetingBubble />
      {/* Screen readers get every language's "choose language" at once */}
      <h1 className="visually-hidden">
        {LANGUAGES.map((l) => (
          <span key={l.code} lang={l.code}>
            {l.choose}.{' '}
          </span>
        ))}
      </h1>
      <ul className="lang-list">
        {LANGUAGES.map((l) => (
          <li key={l.code}>
            <button className="lang-option" lang={l.code} dir={l.dir} disabled={!isSelectable(l, demo)} onClick={() => onPick(l.code)}>
              <span className="lang-name">{l.name}</span>
              {!isSelectable(l, demo) && <span className="badge">{l.soon}</span>}
              {isSelectable(l, demo) && l.draft && <span className="badge badge-extra">DRAFT</span>}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
