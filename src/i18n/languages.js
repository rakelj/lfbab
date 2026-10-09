// Languages shown on the first screen. `hello`, `choose` and `soon` are shown
// before any language is picked, so they live here instead of in the strings
// sheet.
//
// `available`: true = everyone can pick it, 'demo' = only in demo mode (?demo),
// false = shown as "coming soon". `draft`: translation not checked by a
// translator yet (a banner says so).
//
// The 10 languages after Norwegian/English are the ones LFB already has its
// rights information and stories translated into.
//
// TODO: have a translator check the hello/choose/soon lines.
// TODO: decide the order with LFB (see "Language order" in the plan doc).
// Norwegian and English first is fine for testing, but puts the majority
// languages on top. Options: most-spoken among residents first, alphabetical
// by own name, or the device's language (navigator.languages) first.
//
// No flags on purpose: flags stand for countries, not languages, and can be
// painful or political for young people who have fled (see the plan doc).
export const LANGUAGES = [
  { code: 'no', name: 'Norsk', hello: 'Hei!', choose: 'Velg språk', soon: 'Kommer snart', dir: 'ltr', speech: 'nb-NO', available: true },
  { code: 'en', name: 'English', hello: 'Hello!', choose: 'Choose language', soon: 'Coming soon', dir: 'ltr', speech: 'en-GB', available: false },
  { code: 'ar', name: 'العربية', hello: 'مرحبًا!', choose: 'اختر اللغة', soon: 'قريبًا', dir: 'rtl', speech: 'ar-SA', available: 'demo', draft: true },
  { code: 'prs', name: 'دری', hello: 'سلام!', choose: 'زبان را انتخاب کنید', soon: 'به زودی', dir: 'rtl', speech: 'fa-AF', available: false },
  { code: 'fa', name: 'فارسی', hello: 'سلام!', choose: 'زبان را انتخاب کنید', soon: 'به‌زودی', dir: 'rtl', speech: 'fa-IR', available: false },
  { code: 'ps', name: 'پښتو', hello: 'سلام!', choose: 'ژبه وټاکئ', soon: 'ډېر ژر', dir: 'rtl', speech: 'ps-AF', available: false },
  { code: 'ru', name: 'Русский', hello: 'Привет!', choose: 'Выберите язык', soon: 'Скоро', dir: 'ltr', speech: 'ru-RU', available: false },
  { code: 'so', name: 'Soomaali', hello: 'Salaan!', choose: 'Dooro luqadda', soon: 'Dhowaan', dir: 'ltr', speech: 'so-SO', available: false },
  { code: 'es', name: 'Español', hello: '¡Hola!', choose: 'Elige el idioma', soon: 'Próximamente', dir: 'ltr', speech: 'es-419', available: false },
  { code: 'ti', name: 'ትግርኛ', hello: 'ሰላም!', choose: 'ቋንቋ ምረጽ', soon: 'ኣብ ቀረባ እዋን', dir: 'ltr', speech: 'ti-ER', available: false },
  { code: 'tr', name: 'Türkçe', hello: 'Merhaba!', choose: 'Dil seçin', soon: 'Yakında', dir: 'ltr', speech: 'tr-TR', available: false },
  { code: 'uk', name: 'Українська', hello: 'Привіт!', choose: 'Оберіть мову', soon: 'Незабаром', dir: 'ltr', speech: 'uk-UA', available: false },
]

export const DEFAULT_LANG = 'no'

export function getLanguage(code) {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0]
}

export function isSelectable(language, demo) {
  return language.available === true || (language.available === 'demo' && demo)
}
