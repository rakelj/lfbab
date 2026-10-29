import { useI18n } from '../i18n/I18n.jsx'

// The actor and emotion cards still have their names painted on in Norwegian.
// Until the textless versions arrive, other languages show the name as text
// under the picture. With textless art, set PAINTED_NAMES to false so the
// name shows in every language.
export const PAINTED_NAMES = true

// The names as one text for a heading's speaker button, when they are shown.
export function useCardNames(keys) {
  const { t, lang } = useI18n()
  return PAINTED_NAMES && lang === 'no' ? '' : keys.map((k) => t(k)).join(', ')
}

export default function CardName({ text }) {
  const { lang } = useI18n()
  if (PAINTED_NAMES && lang === 'no') return null
  return <span className="card-name">{text}</span>
}
