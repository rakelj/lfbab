// Draws the app's user flow for the plan doc.
//   npm run flowchart  ->  docs/flowchart.svg + public/docs/flowchart.png
// Pink numbered markers match "Points to discuss" in the plan doc.
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'

const C = {
  purple: '#5b4e7c', lavender: '#e9e5f1', sage: '#96a87f', sageLight: '#eef3e6',
  pink: '#ecb8c8', ink: '#2e2a38', muted: '#6b6578', line: '#9489ac', bg: '#ffffff',
}
const FONT = "Segoe UI, Arial, sans-serif"
const W = 1320
const BOX_H = 46
const GAP = 16

const parts = []
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function box(x, y, w, text, { fill = C.bg, stroke = C.line, color = C.ink, bold = false, dashed = false, h = BOX_H } = {}) {
  parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="2"${dashed ? ' stroke-dasharray="7 5"' : ''}/>`)
  const lines = Array.isArray(text) ? text : [text]
  const lh = 17
  const y0 = y + h / 2 - ((lines.length - 1) * lh) / 2 + 5
  lines.forEach((l, i) => {
    parts.push(`<text x="${x + w / 2}" y="${y0 + i * lh}" text-anchor="middle" font-family="${FONT}" font-size="14" fill="${color}"${bold || i === 0 && lines.length > 1 ? ' font-weight="700"' : ''}>${esc(l)}</text>`)
  })
  return { x, y, w, h, cx: x + w / 2, cy: y + h / 2, bottom: y + h, right: x + w }
}

function arrow(x1, y1, x2, y2, { dashed = false, label } = {}) {
  parts.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C.line}" stroke-width="2"${dashed ? ' stroke-dasharray="6 5"' : ''} marker-end="url(#arrow)"/>`)
  if (label) parts.push(`<text x="${(x1 + x2) / 2 + 8}" y="${(y1 + y2) / 2 + 4}" font-family="${FONT}" font-size="12" fill="${C.muted}">${esc(label)}</text>`)
}

function path(d, dashed = false) {
  parts.push(`<path d="${d}" fill="none" stroke="${C.line}" stroke-width="2"${dashed ? ' stroke-dasharray="6 5"' : ''} marker-end="url(#arrow)"/>`)
}

function marker(x, y, n) {
  parts.push(`<circle cx="${x}" cy="${y}" r="13" fill="${C.pink}" stroke="#d98aa3" stroke-width="1.5"/>`)
  parts.push(`<text x="${x}" y="${y + 5}" text-anchor="middle" font-family="${FONT}" font-size="14" font-weight="700" fill="${C.ink}">${n}</text>`)
}

function column(x, y, w, steps) {
  const boxes = []
  steps.forEach((s, i) => {
    const b = box(x, y, w, s.text, s)
    if (s.marker) marker(b.right - 4, b.y + 4, s.marker)
    if (i > 0) arrow(b.cx, boxes[i - 1].bottom, b.cx, b.y - 2)
    boxes.push(b)
    y = b.bottom + GAP
  })
  return boxes
}

// Title
parts.push(`<text x="40" y="44" font-family="${FONT}" font-size="24" font-weight="700" fill="${C.ink}">User flow, prototype v0.2</text>`)
parts.push(`<text x="40" y="68" font-family="${FONT}" font-size="14" fill="${C.muted}">Every screen has help, language and read-aloud buttons. Every chapter step has Back. Pink numbers = points to discuss.</text>`)

// Row 1: first visit
const r1y = 100
const lang = box(40, r1y, 210, ['Choose language', 'Norwegian · Arabic demo'], { fill: C.lavender })
const intro = box(300, r1y, 210, ['Intro', '4 short screens'], { fill: C.lavender })
const checkin = box(560, r1y, 230, ['Mood check-in', 'Pick a weather picture'], { fill: C.lavender })
marker(checkin.right - 4, checkin.y + 4, 1)
arrow(lang.right, lang.cy, intro.x - 2, intro.cy)
arrow(intro.right, intro.cy, checkin.x - 2, checkin.cy)
parts.push(`<text x="840" y="${r1y + 20}" font-family="${FONT}" font-size="13" fill="${C.muted}">First visit only. Returning visitors</text>`)
parts.push(`<text x="840" y="${r1y + 38}" font-family="${FONT}" font-size="13" fill="${C.muted}">go straight to the overview.</text>`)

// Row 2: overview
const hub = box(420, 210, 480, ['Chapter overview', 'Chapters in any order · progress saved on this device'], { fill: C.purple, stroke: C.purple, color: '#fff', h: 56 })
marker(hub.right - 4, hub.y + 4, 7)
path(`M ${checkin.cx} ${checkin.bottom} L ${checkin.cx} ${hub.y - 2}`)

// Row 3: branches
const top = 330
const colW = 228
const xs = [40, 290, 540, 790, 1060]
const busY = top - 26
parts.push(`<line x1="${xs[0] + colW / 2}" y1="${busY}" x2="${xs[4] + colW / 2}" y2="${busY}" stroke="${C.line}" stroke-width="2"/>`)
parts.push(`<line x1="${hub.cx}" y1="${hub.bottom}" x2="${hub.cx}" y2="${busY}" stroke="${C.line}" stroke-width="2"/>`)
xs.forEach((x) => arrow(x + colW / 2, busY, x + colW / 2, top - 2))

const ch = { fill: C.sageLight, stroke: C.sage }
const ch1 = column(xs[0], top, colW, [
  { text: ['Chapter 1', 'Your representative'], fill: C.sage, stroke: C.sage, color: '#fff' },
  { text: 'What is a representative?', ...ch },
  { text: ['3 × "True for you?"', 'Validation for each answer'], ...ch, marker: 3 },
  { text: ['If No / Don\'t know:', '"Show to staff" card'], ...ch, marker: 4 },
  { text: '1 × "Did you know?" myth', ...ch },
  { text: 'Summary', ...ch },
  { text: 'Rights card', fill: C.purple, stroke: C.purple, color: '#fff', bold: true },
])
const ch2 = column(xs[1], top, colW, [
  { text: ['Chapter 2', 'Body and mind'], fill: C.sage, stroke: C.sage, color: '#fff' },
  { text: 'Right to healthcare', ...ch },
  { text: '1 × "Did you know?" myth', ...ch },
  { text: ['Sleep → body → mind', 'one figure at a time'], ...ch },
  { text: ['Choose a story', 'Stille gutt / Innestengt / Skip'], ...ch, marker: 5 },
  { text: ['The story', '5–6 pages, LFB\'s own text'], ...ch },
  { text: 'What does he feel?', ...ch },
  { text: ['Who can help?', 'Pick freely, see how they help'], ...ch },
  { text: ['Read the other story?', 'Yes / No'], ...ch },
  { text: 'Who would you talk to first?', ...ch },
  { text: ['Summary', '+ "Show to staff" card'], ...ch },
  { text: ['Rights card', '+ "Try the game"'], fill: C.purple, stroke: C.purple, color: '#fff', bold: true },
])
// "Yes" loops back from "Read the other story?" to the story
const loopFrom = ch2[8]
const loopTo = ch2[5]
path(`M ${loopFrom.x} ${loopFrom.cy} L ${loopFrom.x - 14} ${loopFrom.cy} L ${loopFrom.x - 14} ${loopTo.cy} L ${loopTo.x - 2} ${loopTo.cy}`, true)
parts.push(`<text x="${loopFrom.x - 18}" y="${(loopFrom.cy + loopTo.cy) / 2}" text-anchor="end" font-family="${FONT}" font-size="12" fill="${C.muted}">yes</text>`)
// Skip path from "Choose a story" to "Who would you talk to first?"
const skipFrom = ch2[4]
const skipTo = ch2[9]
path(`M ${skipFrom.right} ${skipFrom.cy} L ${skipFrom.right + 18} ${skipFrom.cy} L ${skipFrom.right + 18} ${skipTo.cy} L ${skipTo.right + 2} ${skipTo.cy}`, true)
parts.push(`<text x="${skipFrom.right + 24}" y="${(skipFrom.cy + skipTo.cy) / 2}" font-family="${FONT}" font-size="12" fill="${C.muted}">skip</text>`)

const ch3 = column(xs[2], top, colW, [
  { text: ['Chapter 3', 'What do you like to do?'], fill: C.sage, stroke: C.sage, color: '#fff' },
  { text: 'Right to free time', ...ch },
  { text: ['Pick activities', '6 painted cards'], ...ch },
  { text: '1 × "Did you know?" myth', ...ch },
  { text: ['Summary + "Show to staff"', 'card naming your activities'], ...ch },
  { text: 'Rights card', fill: C.purple, stroke: C.purple, color: '#fff', bold: true },
])
// Two separate screens from the overview, so no arrow between them.
box(xs[3], top, colW, ['My rights cards', 'Slots fill up on the overview'], { fill: C.lavender })
box(xs[3], top + BOX_H + GAP, colW, ['Who can help me?', 'Cards that turn over + game'], { fill: C.lavender })
const end = column(xs[4], top, colW, [
  { text: ['"Finish for today"', 'button'], fill: C.lavender, marker: 2 },
  { text: ['Mood check-in again', 'Weather picture'], fill: C.lavender, marker: 2 },
  { text: ['Closing', 'Before/after weather, key', 'messages, cards, contact'], fill: C.lavender, h: 64 },
])

// Back to overview notes
const backY = Math.max(ch1.at(-1).bottom, ch2.at(-1).bottom) + 30
for (const b of [ch1.at(-1), ch2.at(-1), ch3.at(-1), end.at(-1)]) {
  parts.push(`<text x="${b.cx}" y="${b.bottom + 22}" text-anchor="middle" font-family="${FONT}" font-size="12" fill="${C.muted}">→ back to overview</text>`)
}
const startOver = box(xs[3], top + 2 * (BOX_H + GAP) + 30, colW, ['"Start over"', 'Clears progress → language'], { fill: '#fff', stroke: C.line, color: C.muted, h: 54 })
parts.push(`<text x="${startOver.cx}" y="${startOver.y - 10}" text-anchor="middle" font-family="${FONT}" font-size="12" fill="${C.muted}">from the overview</text>`)

// Legend
const ly = backY + 30
const legend = [
  [C.lavender, C.line, false, 'Shared screens'],
  [C.sageLight, C.sage, false, 'Chapter steps'],
]
legend.forEach(([fill, stroke, dashed, label], i) => {
  const x = 40 + i * 200
  parts.push(`<rect x="${x}" y="${ly}" width="28" height="18" rx="5" fill="${fill}" stroke="${stroke}" stroke-width="2"${dashed ? ' stroke-dasharray="5 4"' : ''}/>`)
  parts.push(`<text x="${x + 38}" y="${ly + 14}" font-family="${FONT}" font-size="13" fill="${C.ink}">${label}</text>`)
})
marker(40 + 2 * 200 + 14, ly + 9, 'n')
parts.push(`<text x="${40 + 2 * 200 + 36}" y="${ly + 14}" font-family="${FONT}" font-size="13" fill="${C.ink}">Point to discuss</text>`)

const H = ly + 50
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${C.line}"/></marker></defs>
<rect width="100%" height="100%" fill="#fff"/>
${parts.join('\n')}
</svg>`

const docsDir = fileURLToPath(new URL('../docs/', import.meta.url))
const pubDir = fileURLToPath(new URL('../public/docs/', import.meta.url))
mkdirSync(docsDir, { recursive: true })
mkdirSync(pubDir, { recursive: true })
writeFileSync(docsDir + 'flowchart.svg', svg)
const png = new Resvg(svg, { fitTo: { mode: 'width', value: W * 2 }, font: { loadSystemFonts: true } }).render().asPng()
writeFileSync(pubDir + 'flowchart.png', png)
console.log(`flowchart: ${W}x${H} → docs/flowchart.svg, public/docs/flowchart.png (${Math.round(png.length / 1024)} KB)`)
