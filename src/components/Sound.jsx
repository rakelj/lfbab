import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useI18n } from '../i18n/I18n.jsx'
import { getLanguage } from '../i18n/languages.js'

// Read-aloud with the device's own text-to-speech voice (demo for the
// generated-audio idea). Off by default and never remembered between visits,
// since sound can reveal private answers on a shared device.
const SoundContext = createContext({ available: false, on: false })

function findVoice(speechLang) {
  if (!('speechSynthesis' in window)) return null
  const voices = window.speechSynthesis.getVoices()
  const base = speechLang.split('-')[0]
  // Norwegian voices may be tagged nb, no or nn.
  const bases = base === 'nb' ? ['nb', 'no', 'nn'] : [base]
  return voices.find((v) => v.lang.replace('_', '-') === speechLang) ?? voices.find((v) => bases.includes(v.lang.slice(0, 2)))
}

export function SoundProvider({ children }) {
  const { lang } = useI18n()
  const speechLang = getLanguage(lang).speech
  const [voice, setVoice] = useState(null)
  const [on, setOn] = useState(false)
  const [speaking, setSpeaking] = useState(null)

  // Voices load asynchronously in most browsers.
  useEffect(() => {
    if (!('speechSynthesis' in window)) return
    const pick = () => setVoice(findVoice(speechLang))
    pick()
    window.speechSynthesis.addEventListener('voiceschanged', pick)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', pick)
  }, [speechLang])

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    setSpeaking(null)
  }, [])

  const speak = useCallback(
    (text) => {
      if (!voice) return
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.voice = voice
      u.lang = voice.lang
      u.rate = 0.95
      u.onend = u.onerror = () => setSpeaking((s) => (s === text ? null : s))
      setSpeaking(text)
      window.speechSynthesis.speak(u)
    },
    [voice],
  )

  const toggle = useCallback(() => {
    setOn((v) => {
      if (v) stop()
      return !v
    })
  }, [stop])

  // Stop talking when the screen changes language or sound is turned off.
  useEffect(() => stop, [lang, stop])

  const value = useMemo(() => ({ available: !!voice, on: on && !!voice, toggle, speak, stop, speaking }), [voice, on, toggle, speak, stop, speaking])
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export function useSound() {
  return useContext(SoundContext)
}

function SpeakerIcon({ muted }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
      {muted ? <path d="M17 9l5 6M22 9l-5 6" /> : <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />}
    </svg>
  )
}

// Top bar button. Shows a short headphones hint when turned on.
export function SoundToggle() {
  const { t } = useI18n()
  const { available, on, toggle } = useSound()
  const [hint, setHint] = useState(false)

  useEffect(() => {
    if (!hint) return
    const id = setTimeout(() => setHint(false), 6000)
    return () => clearTimeout(id)
  }, [hint])

  if (!available) return null

  return (
    <>
      <button
        className={`sound-toggle ${on ? 'on' : ''}`}
        aria-pressed={on}
        aria-label={on ? t('sound.off') : t('sound.on')}
        onClick={() => {
          if (!on) setHint(true)
          toggle()
        }}
      >
        <SpeakerIcon muted={!on} />
      </button>
      {hint && on && (
        <div className="sound-hint" role="status" onClick={() => setHint(false)}>
          {t('sound.hint')}
        </div>
      )}
    </>
  )
}

// Small speaker button that reads `text` aloud. Renders nothing while sound is off.
export function Speak({ text, className = '' }) {
  const { t } = useI18n()
  const { on, speak, stop, speaking } = useSound()
  if (!on || !text) return null
  const active = speaking === text
  return (
    <button
      type="button"
      className={`speak ${active ? 'active' : ''} ${className}`}
      aria-label={t('sound.read')}
      onClick={(e) => {
        e.stopPropagation()
        active ? stop() : speak(text)
      }}
    >
      <SpeakerIcon />
    </button>
  )
}
