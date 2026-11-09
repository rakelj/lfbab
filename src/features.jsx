import { createContext, useCallback, useContext, useMemo, useState } from 'react'

// Parts of the app that can be switched on and off. `default` is what everyone
// gets. In demo mode (?demo) the settings panel can override them on this
// device, so LFB can try different versions.
export const FEATURES = [
  { id: 'introFilm', group: 'flow', label: 'Introfilm (første besøk)', default: true },
  { id: 'readAloud', group: 'flow', label: 'Opplesning (høyttalerknapp)', default: true },
]

const KEY = 'lfb-features-v1'
const defaults = Object.fromEntries(FEATURES.map((f) => [f.id, f.default]))

function loadOverrides() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? {}
  } catch {
    return {}
  }
}

const FeaturesContext = createContext({ on: (id) => defaults[id] ?? true })

export function FeaturesProvider({ demo, children }) {
  // Only demo mode can override the defaults.
  const [overrides, setOverrides] = useState(() => (demo ? loadOverrides() : {}))

  const set = useCallback((id, value) => {
    setOverrides((prev) => {
      const next = { ...prev, [id]: value }
      try {
        localStorage.setItem(KEY, JSON.stringify(next))
      } catch {}
      return next
    })
  }, [])

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(KEY)
    } catch {}
    setOverrides({})
  }, [])

  const value = useMemo(
    () => ({ on: (id) => overrides[id] ?? defaults[id] ?? true, set, reset, demo }),
    [overrides, set, reset, demo],
  )
  return <FeaturesContext.Provider value={value}>{children}</FeaturesContext.Provider>
}

export function useFeatures() {
  return useContext(FeaturesContext)
}
