// Anonymous answers for LFB's overview. In v0.1 nothing leaves the device;
// v0.2 will POST { question, answer, lang, date } to a Google Apps Script
// that appends a row to LFB's sheet. Never add names, free text or IDs here.
export function recordAnswer(question, answer, lang) {
  const row = { question, answer, lang, date: new Date().toISOString().slice(0, 10) }
  if (import.meta.env.DEV) console.info('[answer]', row)
}
