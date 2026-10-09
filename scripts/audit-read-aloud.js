// Read-aloud audit: lists visible text that no speaker button reads.
// Paste into the browser console on the current screen (any language whose
// voice the device has). It turns sound on, clicks every speaker button to
// record what it would say (nothing is actually spoken), and prints the text
// left over. Buttons, badges and the top/bottom bars are not counted.
// Repeat on each screen and step, after answering, so feedback boxes show.
;(async () => {
  const w = (ms) => new Promise((r) => setTimeout(r, ms))
  const spoken = []
  speechSynthesis.speak = (u) => {
    spoken.push(u.text)
    setTimeout(() => u.onend && u.onend(), 0)
  }
  const toggle = document.querySelector('.sound-toggle:not(.on)')
  if (toggle) {
    toggle.click()
    await w(150)
  }
  const norm = (s) => s.replace(/[«»"“”]/g, '').replace(/\s+/g, ' ').trim().toLowerCase()
  const scope = [document.querySelector('main'), ...document.querySelectorAll('.modal')].filter(Boolean)
  for (const root of scope)
    for (const b of root.querySelectorAll('.speak')) {
      b.click()
      await w(15)
      if (b.classList.contains('active')) b.click()
    }
  const said = spoken.map(norm)
  const missing = []
  for (const root of scope)
    for (const el of root.querySelectorAll('*')) {
      if (el.closest('.topbar, .site-footer, .build-stamp, [aria-hidden="true"], svg, .actions, .chapter-bar, .badge, .btn, .modal > .btn-secondary')) continue
      if (!el.getClientRects().length) continue
      const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' ').trim()
      if (own.replace(/[^\p{L}\p{N}]/gu, '').length < 2) continue
      if (!said.some((s) => s.includes(norm(own)))) missing.push(own.replace(/\s+/g, ' '))
    }
  console.log(`${spoken.length} speaker buttons. Not read aloud:`, missing.length ? missing : 'nothing')
})()
