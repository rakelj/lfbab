import { useState } from 'react'
import { I18nProvider } from './i18n/I18n.jsx'
import { DEFAULT_LANG, getLanguage, isSelectable } from './i18n/languages.js'
import { useProgress } from './progress.js'
import { findChapter, img } from './content.js'
import { FeaturesProvider, useFeatures } from './features.jsx'
import HelpButton from './components/Help.jsx'
import LanguageScreen from './screens/LanguageScreen.jsx'
import Intro from './screens/Intro.jsx'
import IntroFilm from './screens/IntroFilm.jsx'
import CheckIn from './screens/CheckIn.jsx'
import Hub from './screens/Hub.jsx'
import Chapter from './screens/Chapter.jsx'
import Cards from './screens/Cards.jsx'
import Closing from './screens/Closing.jsx'
import Helpers from './screens/Helpers.jsx'
import HelperGame from './screens/HelperGame.jsx'
import About from './screens/About.jsx'
import Footer from './components/Footer.jsx'
import LanguageButton from './components/LanguageButton.jsx'
import DemoSettings from './components/DemoSettings.jsx'
import { SoundProvider, SoundToggle } from './components/Sound.jsx'

// Demo mode: open the app with ?demo to get a restart button, demo settings
// and a version stamp. Remembered for the browser tab.
function isDemo() {
  const asked = new URLSearchParams(window.location.search).has('demo')
  try {
    if (asked) sessionStorage.setItem('lfb-demo', '1')
    return asked || sessionStorage.getItem('lfb-demo') === '1'
  } catch {
    return asked
  }
}

// e.g. "v0.2.0 · 4946e46 · 09.10.2026 14:32" (build time in Norwegian time)
function buildStamp() {
  const { version, commit, time } = __BUILD__
  const when = new Date(time).toLocaleString('nb-NO', { timeZone: 'Europe/Oslo', dateStyle: 'short', timeStyle: 'short' })
  return `v${version} · ${commit} · ${when}`
}

function firstScreen(p) {
  if (!p.lang) return 'lang'
  if (!p.introDone) return 'intro'
  return 'hub'
}

export default function App() {
  const [demo] = useState(isDemo)
  return (
    <FeaturesProvider demo={demo}>
      <Screens demo={demo} />
    </FeaturesProvider>
  )
}

function Screens({ demo }) {
  const { progress, update, completeChapter, reset } = useProgress()
  const { on } = useFeatures()
  // A language picked in demo mode (e.g. Arabic) isn't used on the normal link.
  const language = progress.lang && isSelectable(getLanguage(progress.lang), demo) ? getLanguage(progress.lang) : getLanguage(DEFAULT_LANG)
  const [screen, setScreen] = useState(() => firstScreen(progress))
  const [chapterId, setChapterId] = useState(null)
  // Screen to return to from "Om appen".
  const [aboutFrom, setAboutFrom] = useState('hub')
  // Screen to return to from the "Who can help?" game.
  const [gameFrom, setGameFrom] = useState('helpers')
  const openGame = (from) => {
    setGameFrom(from)
    go('game')
  }

  const go = (s) => {
    setScreen(s)
    window.scrollTo({ top: 0 })
  }

  let content
  switch (screen) {
    case 'lang':
      content = (
        <LanguageScreen
          onPick={(lang) => {
            update({ lang })
            go(progress.introDone ? 'hub' : on('introFilm') ? 'film' : 'intro')
          }}
        />
      )
      break
    case 'film':
      content = <IntroFilm onDone={() => go('intro')} />
      break
    case 'intro':
      content = (
        <Intro
          onDone={() => {
            update({ introDone: true })
            go(on('checkin') ? 'checkin' : 'hub')
          }}
        />
      )
      break
    case 'checkin':
      content = (
        <CheckIn
          kind="checkin"
          initial={progress.checkin}
          onDone={(checkin) => {
            update({ checkin })
            go('hub')
          }}
        />
      )
      break
    case 'chapter':
      content = <Chapter chapter={findChapter(chapterId)} onComplete={completeChapter} onExit={() => go('hub')} onGame={() => openGame('hub')} />
      break
    case 'cards':
      content = <Cards cards={progress.cards} onBack={() => go('hub')} />
      break
    case 'about':
      content = <About onBack={() => go(aboutFrom)} />
      break
    case 'helpers':
      content = <Helpers onBack={() => go('hub')} onGame={() => openGame('helpers')} />
      break
    case 'game':
      content = <HelperGame onBack={() => go(gameFrom)} />
      break
    case 'checkout':
      content = (
        <CheckIn
          kind="checkout"
          initial={null}
          onDone={(checkout) => {
            update({ checkout })
            go('closing')
          }}
        />
      )
      break
    case 'closing':
      content = <Closing progress={progress} onBack={() => go('hub')} />
      break
    default:
      content = (
        <Hub
          progress={progress}
          onOpen={(id) => {
            setChapterId(id)
            go('chapter')
          }}
          onCards={() => go('cards')}
          onHelpers={() => go('helpers')}
          onFinish={() => go(on('checkout') ? 'checkout' : 'closing')}
          onRestart={() => {
            reset()
            go('lang')
          }}
        />
      )
  }

  return (
    <I18nProvider lang={language.code}>
      <SoundProvider>
        <div className="app">
          {/* The language screen has no top bar, except the demo buttons in demo mode. */}
          {(screen !== 'lang' || demo) && (
            <header className="topbar">
              {demo ? (
                <div className="demo-tools">
                  <button
                    className="demo-restart"
                    onClick={() => {
                      reset()
                      setChapterId(null)
                      go('lang')
                    }}
                  >
                    ↺ <span className="demo-label">Demo</span>
                  </button>
                  <DemoSettings />
                </div>
              ) : (
                <img className="topbar-logo" src={img('logo.png')} alt="LFB" />
              )}
              {screen !== 'lang' && (
                <div className="topbar-actions">
                  {on('readAloud') && <SoundToggle />}
                  <LanguageButton onClick={() => go('lang')} />
                  <HelpButton />
                </div>
              )}
            </header>
          )}
          {language.draft && screen !== 'lang' && (
            <p className="draft-banner" dir="ltr">
              DRAFT TRANSLATION (not checked yet)
            </p>
          )}
          <main>{content}</main>
          {screen !== 'chapter' && screen !== 'about' && (
            <Footer
              onAbout={() => {
                setAboutFrom(screen)
                go('about')
              }}
            />
          )}
          {demo && <footer className="build-stamp">{buildStamp()}</footer>}
        </div>
      </SoundProvider>
    </I18nProvider>
  )
}
