// Pulls the app text from the translation sheet into src/i18n/strings.json.
//   npm run sync-strings
// The sheet must be shared as "Anyone with the link can view" (it only holds
// public app text). Columns: key | context | no | en | uk | ru | so | ...
// Any extra language column is picked up automatically.
//
//   node scripts/sync-strings.mjs --export   writes strings.csv from the JSON,
//                                            for seeding a new sheet.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const SHEET_ID = process.env.STRINGS_SHEET_ID || '' // TODO: set once the sheet exists
const JSON_PATH = fileURLToPath(new URL('../src/i18n/strings.json', import.meta.url))
const CSV_PATH = fileURLToPath(new URL('../strings.csv', import.meta.url))
const LANGS = ['no', 'en', 'uk', 'ru', 'so']

function parseCsv(text) {
  const rows = []
  let row = [], field = '', quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++ }
      else if (c === '"') quoted = false
      else field += c
    } else if (c === '"') quoted = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(field); rows.push(row); row = []; field = ''
    } else field += c
  }
  if (field || row.length) { row.push(field); rows.push(row) }
  return rows
}

const csvCell = (s = '') => (/[",\n\r]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s)

if (process.argv.includes('--export')) {
  const strings = JSON.parse(readFileSync(JSON_PATH, 'utf8'))
  const lines = [['key', 'context', ...LANGS].join(',')]
  for (const [key, entry] of Object.entries(strings)) {
    lines.push([key, entry.context, ...LANGS.map((l) => entry[l])].map(csvCell).join(','))
  }
  writeFileSync(CSV_PATH, '﻿' + lines.join('\r\n') + '\r\n')
  console.log(`Wrote ${lines.length - 1} strings to strings.csv`)
  process.exit(0)
}

if (!SHEET_ID) {
  console.error('Set STRINGS_SHEET_ID (or the constant in this script) to the sheet ID.')
  process.exit(1)
}

const res = await fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`)
if (!res.ok || !res.headers.get('content-type')?.includes('text/csv')) {
  console.error(`Could not download the sheet (HTTP ${res.status}). Is it shared as "Anyone with the link can view"?`)
  process.exit(1)
}

const [header, ...rows] = parseCsv((await res.text()).replace(/^﻿/, ''))
const col = Object.fromEntries(header.map((h, i) => [h.trim(), i]))
if (col.key === undefined || col.no === undefined) {
  console.error('The first row must have "key" and "no" columns.')
  process.exit(1)
}
const langCols = header.map((h) => h.trim()).filter((h) => h && h !== 'key' && h !== 'context')

const strings = {}
for (const r of rows) {
  const key = r[col.key]?.trim()
  if (!key) continue
  const entry = { context: r[col.context] ?? '' }
  for (const l of langCols) if (r[col[l]]?.trim()) entry[l] = r[col[l]].trim()
  strings[key] = entry
}

writeFileSync(JSON_PATH, JSON.stringify(strings, null, 2) + '\n')
const counts = langCols.map((l) => `${l}: ${Object.values(strings).filter((e) => e[l]).length}`)
console.log(`Synced ${Object.keys(strings).length} strings (${counts.join(', ')})`)
