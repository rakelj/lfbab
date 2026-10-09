import { createContext, useCallback, useContext, useMemo, useState } from 'react'

// Parts of the app that can be switched on and off. `default` is what everyone
// gets. In demo mode (?demo) the settings panel can override them on this
// device, so LFB can try different versions.
//
// Extra content (`extra: true`) is not from LFB's workshop. It comes from LFB's
// rights information documents and lives in src/content/extra.js with texts
// starting with "x." in strings.json. To remove it all: delete extra.js, its
// import in content.js, these entries and the "x." strings.
export const FEATURES = [
  { id: 'checkin', group: 'flow', label: 'Humørsjekk (vær) ved start', default: true },
  { id: 'checkout', group: 'flow', label: 'Humørsjekk (vær) når man avslutter', default: true },
  { id: 'readAloud', group: 'flow', label: 'Opplesning (høyttalerknapp)', default: true },
  { id: 'x.safety', group: 'extra', label: 'Trygghet', default: true, extra: true },
  { id: 'x.centre', group: 'extra', label: 'Rettighetene dine på mottaket', default: true, extra: true },
  { id: 'x.cws', group: 'extra', label: 'Barnevernet', default: true, extra: true },
  { id: 'x.money', group: 'extra', label: 'Penger og skole', default: true, extra: true },
  { id: 'x.complain', group: 'extra', label: 'Hvordan klage', default: true, extra: true },
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
