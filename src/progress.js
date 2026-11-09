import { useCallback, useEffect, useState } from 'react'

// Progress is kept on the device only. It deliberately holds no answers to
// personal questions, since the device may be shared. After an hour without
// use it is forgotten, so the next person on a shared tablet starts afresh.
const KEY = 'lfb-progress-v1'
export const FORGET_AFTER = 60 * 60 * 1000
const fresh = (at) => typeof at === 'number' && Date.now() - at < FORGET_AFTER

const EMPTY = {
  lang: null,
  introDone: false,
  done: [], // finished chapter ids
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    const saved = raw ? JSON.parse(raw) : null
    if (!saved || !fresh(saved.at)) {
      if (raw) localStorage.removeItem(KEY)
      return EMPTY
    }
    return { ...EMPTY, ...saved }
  } catch {
    return EMPTY
  }
}

function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...state, at: Date.now() }))
  } catch {
    // Private mode or blocked storage: the app still works, it just won't remember.
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(load)

  // Any touch or key counts as use. If the app was left open for an hour,
  // start again from the beginning instead of carrying on.
  useEffect(() => {
    let last = Date.now()
    const touch = () => {
      const now = Date.now()
      if (now - last >= FORGET_AFTER) {
        try {
          localStorage.removeItem(KEY)
        } catch {}
        window.location.reload()
        return
      }
      // Write the time at most once a minute; nothing else is stored.
      if (now - last > 60 * 1000) {
        try {
          const raw = localStorage.getItem(KEY)
          if (raw) localStorage.setItem(KEY, JSON.stringify({ ...JSON.parse(raw), at: now }))
        } catch {}
      }
      last = now
    }
    const onVisible = () => document.visibilityState === 'visible' && touch()
    window.addEventListener('pointerdown', touch, true)
    window.addEventListener('keydown', touch, true)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.removeEventListener('pointerdown', touch, true)
      window.removeEventListener('keydown', touch, true)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  const update = useCallback((patch) => {
    setProgress((prev) => {
      const next = { ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }
      save(next)
      return next
    })
  }, [])

  const completeChapter = useCallback(
    (chapterId) =>
      update((prev) => ({
        done: prev.done.includes(chapterId) ? prev.done : [...prev.done, chapterId],
      })),
    [update],
  )

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(KEY)
    } catch {}
    setProgress(EMPTY)
  }, [])

  return { progress, update, completeChapter, reset }
}
