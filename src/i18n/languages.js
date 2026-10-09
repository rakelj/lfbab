// Languages shown on the first screen. `choose` and `soon` are shown before any
// language is picked, so they live here instead of in the strings sheet.
// TODO: have a translator check the uk/ru/so lines.
// TODO: decide the order with LFB (see "Language order" in the plan doc).
// Norwegian and English first is fine for testing, but puts the majority
// languages on top. Options: most-spoken among residents first, alphabetical
// by own name, or the device's language (navigator.languages) first.
export const LANGUAGES = [
// No flags on purpose: flags stand for countries, not languages, and can be
// painful or political for young people who have fled (see the plan doc).
  { code: 'no', name: 'Norsk', hello: 'Hei!', choose: 'Velg språk', soon: 'Kommer snart', dir: 'ltr', speech: 'nb-NO', available: true },
  { code: 'en', name: 'English', hello: 'Hello!', choose: 'Choose language', soon: 'Coming soon', dir: 'ltr', speech: 'en-GB', available: false },
  { code: 'uk', name: 'Українська', hello: 'Привіт!', choose: 'Оберіть мову', soon: 'Незабаром', dir: 'ltr', speech: 'uk-UA', available: false },
  { code: 'ru', name: 'Русский', hello: 'Привет!', choose: 'Выберите язык', soon: 'Скоро', dir: 'ltr', speech: 'ru-RU', available: false },
  { code: 'so', name: 'Soomaali', hello: 'Salaan!', choose: 'Dooro luqadda', soon: 'Dhowaan', dir: 'ltr', speech: 'so-SO', available: false },
]

export const DEFAULT_LANG = 'no'

export function getLanguage(code) {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0]
}
