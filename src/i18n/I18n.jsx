import { createContext, useContext, useEffect, useMemo } from 'react'
import strings from './strings.json'
import { DEFAULT_LANG, getLanguage } from './languages.js'

const I18nContext = createContext(null)

// Falls back to Norwegian, then to the key itself, so a missing translation
// never shows an empty screen.
function lookup(key, lang) {
  const entry = strings[key]
  if (!entry) {
    if (import.meta.env.DEV) console.warn(`Missing string: ${key}`)
    return key
  }
  return entry[lang] || entry[DEFAULT_LANG] || key
}

export function I18nProvider({ lang, children }) {
  const language = getLanguage(lang)

  useEffect(() => {
    document.documentElement.lang = language.code
    document.documentElement.dir = language.dir
  }, [language])

  const value = useMemo(
    () => ({
      lang: language.code,
      // Optional vars fill placeholders like {name}.
      t: (key, vars) => {
        const s = lookup(key, language.code)
        return vars ? s.replace(/\{(\w+)\}/g, (m, v) => vars[v] ?? m) : s
      },
      has: (key) => key in strings,
      // Cards shown to staff stay in Norwegian whatever language the kid uses.
      tStaff: (key) => lookup(key, DEFAULT_LANG),
    }),
    [language],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  return useContext(I18nContext)
}
