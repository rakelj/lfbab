import { useEffect, useRef } from 'react'

// The browser's Back (and Android's back button, which is the same thing)
// stays inside the app. The app keeps one history entry ahead of the page;
// when Back pops it, the innermost "back" that is showing runs instead:
//   WINDOW  closes an open window (help, a card, settings)
//   PAGE    goes to the previous page inside a step (a story, the chain)
//   STEP    goes to the previous step in a topic, intro, film or practice
//   SCREEN  goes to the previous screen (a topic back to the overview)
// A back action returns true when it went somewhere. Only when nothing can go
// back any further (the overview, or the first screen) does Back leave the app.
export const WINDOW = 4
export const PAGE = 3
export const STEP = 2
export const SCREEN = 1

const backs = []
let armed = false

const arm = () => window.history.pushState({ lfb: true }, '')

export function initBackButton() {
  if (armed) return
  armed = true
  arm()
  window.addEventListener('popstate', () => {
    // The highest level wins; among equals, the one shown last.
    const top = backs.reduce((best, b) => (!best || b.level >= best.level ? b : best), null)
    if (top && top.run.current()) arm()
    else window.history.back()
  })
}

// Registers a back action while the component is shown (and `active`).
export function useBack(level, run, active = true) {
  const ref = useRef(run)
  ref.current = run
  useEffect(() => {
    if (!active) return
    const entry = { level, run: ref }
    backs.push(entry)
    return () => {
      const i = backs.indexOf(entry)
      if (i !== -1) backs.splice(i, 1)
    }
  }, [level, active])
}
