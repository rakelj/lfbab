import { useCallback, useState } from 'react'

// Progress is kept on the device only. It deliberately holds no answers to
// personal questions, since the device may be shared.
const KEY = 'lfb-progress-v1'

const EMPTY = {
  lang: null,
  introDone: false,
  checkin: null, // weather id
  checkout: null,
  done: [], // finished chapter ids
  cards: [], // collected rights card ids
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY
  } catch {
    return EMPTY
  }
}

function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Private mode or blocked storage: the app still works, it just won't remember.
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(load)

  const update = useCallback((patch) => {
    setProgress((prev) => {
      const next = { ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }
      save(next)
      return next
    })
  }, [])

  const completeChapter = useCallback(
    (chapterId, cardId) =>
      update((prev) => ({
        done: prev.done.includes(chapterId) ? prev.done : [...prev.done, chapterId],
        cards: !cardId || prev.cards.includes(cardId) ? prev.cards : [...prev.cards, cardId],
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
