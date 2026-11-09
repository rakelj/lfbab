// Click-through test of the whole app in a real browser (Playwright + Chromium).
//
//   npm run build && npx vite preview --port 4173 &
//   node scripts/test-app.cjs [url] [languages]
//
// Defaults: http://localhost:4173, languages "no,ar". For each language it
// walks every topic from start to end (answering the questions, choosing a
// story), opens the help window, "Hvem kan hjelpe meg?" and the practice, and
// runs the read-aloud audit (scripts/audit-read-aloud.js) on every screen.
// It prints each screen's heading and anything wrong, and exits with code 1
// if there were page errors or text that no speaker button reads.
//
// The device has no voices in a headless browser, so the test gives it one
// fake voice per language; nothing is spoken.
const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')

const url = process.argv[2] || 'http://localhost:4173'
const langs = (process.argv[3] || 'no,ar').split(',')
const audit = fs.readFileSync(path.join(__dirname, 'audit-read-aloud.js'), 'utf8')
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const problems = []

async function open(browser, lang) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await page.addInitScript(() => {
    const voices = [{ lang: 'nb-NO', name: 'test-no' }, { lang: 'ar-SA', name: 'test-ar' }]
    speechSynthesis.getVoices = () => voices
    speechSynthesis.speak = (u) => setTimeout(() => u.onend && u.onend(), 0)
    window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text } }
  })
  page.on('pageerror', (e) => problems.push(`${lang}: page error: ${e.message}`))
  page.on('console', (m) => {
    const text = m.text()
    if (/Content Security Policy|Refused to/.test(text)) problems.push(`${lang}: ${page.__where}: ${text}`)
    if (text.startsWith('0 speaker') || /speaker buttons/.test(text)) {
      if (!/Not read aloud: nothing/.test(text)) problems.push(`${lang}: ${page.__where}: ${text}`)
    }
  })
  await page.goto(`${url}/?demo`)
  await page.evaluate((l) => localStorage.setItem('lfb-progress-v1', JSON.stringify({ lang: l, introDone: true, at: Date.now() })), lang)
  await page.reload()
  return page
}

async function check(page, where) {
  page.__where = where
  await page.evaluate(audit)
  await wait(700)
}

const heading = (page) => page.locator('h1').first().innerText().catch(() => '')

async function walkTopic(page, lang, i) {
  await page.locator('.station-button').nth(i).click()
  await wait(250)
  const title = await page.locator('.chapter-name').innerText()
  const seen = []
  for (let n = 0; n < 30; n++) {
    if (!(await page.locator('.chapter-name').count())) break // back on the overview
    const story = page.locator('.story-choice').first()
    if ((await story.count()) && !(await page.locator('.story-choice.selected').count())) await story.click()
    const answer = page.locator('.answer-false, .answer-no').first()
    if (await answer.count()) await answer.click()
    await wait(150)
    const h = (await heading(page)).trim()
    seen.push(h.slice(0, 50))
    await check(page, `${title} / ${h.slice(0, 40)}`)
    const next = page.locator('.actions .btn-primary:not([disabled])').last()
    if (!(await next.count())) { problems.push(`${lang}: ${title}: no way forward at "${h}"`); break }
    await next.click()
    await wait(250)
  }
  console.log(`  ${title}: ${seen.length} screens`)
}

;(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' })
  for (const lang of langs) {
    console.log(`== ${lang}`)
    const page = await open(browser, lang)
    const topics = await page.locator('.station-button').count()
    for (let i = 0; i < topics; i++) await walkTopic(page, lang, i)

    await page.locator('.help-button').click()
    await wait(300)
    await check(page, 'help window')
    await page.locator('.modal .btn-secondary').last().click()

    await page.locator('.actions-stack .btn-secondary').first().click()
    await wait(250)
    await check(page, 'who can help me')
    await page.locator('.game-button').click()
    await wait(250)
    for (let s = 0; s < 6; s++) {
      await check(page, `practice ${s + 1}`)
      await page.locator('.game-grid .pick-card').first().click()
      await page.locator('.actions .btn-primary').click()
      await wait(150)
      await page.locator('.actions .btn-primary').click()
      await wait(200)
    }
    await check(page, 'practice end')
    console.log(`  help, who can help me, practice: done`)
    await page.close()
  }
  await browser.close()
  if (problems.length) {
    console.log(`\n${problems.length} problem(s):\n` + problems.join('\n'))
    process.exit(1)
  }
  console.log('\nNo problems.')
})()
