import { useI18n } from '../i18n/I18n.jsx'

// Names on LFB's cards, as text so they can be translated.
//
// Actor cards: the name sits on a dark panel over the name painted at the top
// of the picture, in every language. It uses the same text as the title on the
// back of the card (actor.<id>), so it is only translated once.
//
// Emotion cards still have their names painted on in Norwegian. Until the
// textless versions arrive, other languages show the name under the picture.
// With textless art, set PAINTED_NAMES to false so it shows in every language.
export const PAINTED_NAMES = true

const shown = (overlay, lang) => overlay || !(PAINTED_NAMES && lang === 'no')

// The names as one text for a heading's speaker button, when they are shown.
export function useCardNames(keys, { overlay = false } = {}) {
  const { t, lang } = useI18n()
  return shown(overlay, lang) ? keys.map((k) => t(k)).join(', ') : ''
}

export default function CardName({ text, overlay = false }) {
  const { lang } = useI18n()
  if (!shown(overlay, lang)) return null
  return <span className={`card-name ${overlay ? 'card-name-overlay' : ''}`}>{text}</span>
}
