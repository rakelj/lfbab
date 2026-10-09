// Languages shown on the first screen. `choose` and `soon` are shown before any
// language is picked, so they live here instead of in the strings sheet.
// TODO: have a translator check the uk/ru/so lines.
export const LANGUAGES = [
  { code: 'no', name: 'Norsk', choose: 'Velg språk', soon: 'Kommer snart', dir: 'ltr', available: true },
  { code: 'en', name: 'English', choose: 'Choose language', soon: 'Coming soon', dir: 'ltr', available: false },
  { code: 'uk', name: 'Українська', choose: 'Оберіть мову', soon: 'Незабаром', dir: 'ltr', available: false },
  { code: 'ru', name: 'Русский', choose: 'Выберите язык', soon: 'Скоро', dir: 'ltr', available: false },
  { code: 'so', name: 'Soomaali', choose: 'Dooro luqadda', soon: 'Dhowaan', dir: 'ltr', available: false },
]

export const DEFAULT_LANG = 'no'

export function getLanguage(code) {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0]
}
