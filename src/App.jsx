import { useState } from 'react'
import { I18nProvider } from './i18n/I18n.jsx'
import { DEFAULT_LANG } from './i18n/languages.js'
import { useProgress } from './progress.js'
import { CHAPTERS, img } from './content.js'
import HelpButton from './components/Help.jsx'
import LanguageScreen from './screens/LanguageScreen.jsx'
import Intro from './screens/Intro.jsx'
import CheckIn from './screens/CheckIn.jsx'
import Hub from './screens/Hub.jsx'
import Chapter from './screens/Chapter.jsx'
import Cards from './screens/Cards.jsx'
import Closing from './screens/Closing.jsx'

function firstScreen(p) {
  if (!p.lang) return 'lang'
  if (!p.introDone) return 'intro'
  return 'hub'
}

export default function App() {
  const { progress, update, completeChapter, reset } = useProgress()
  const [screen, setScreen] = useState(() => firstScreen(progress))
  const [chapterId, setChapterId] = useState(null)

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
            go(progress.introDone ? 'hub' : 'intro')
          }}
        />
      )
      break
    case 'intro':
      content = (
        <Intro
          onDone={() => {
            update({ introDone: true })
            go('checkin')
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
      content = (
        <Chapter
          chapter={CHAPTERS.find((c) => c.id === chapterId)}
          onComplete={completeChapter}
          onExit={() => go('hub')}
        />
      )
      break
    case 'cards':
      content = <Cards cards={progress.cards} onBack={() => go('hub')} />
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
          onFinish={() => go('checkout')}
          onRestart={() => {
            reset()
            go('lang')
          }}
        />
      )
  }

  return (
    <I18nProvider lang={progress.lang ?? DEFAULT_LANG}>
      <div className="app">
        {screen !== 'lang' && (
          <header className="topbar">
            <button className="logo-button" onClick={() => go('lang')} aria-label="Språk / Language">
              <img src={img('logo.png')} alt="LFB" />
            </button>
            <HelpButton />
          </header>
        )}
        <main>{content}</main>
      </div>
    </I18nProvider>
  )
}
