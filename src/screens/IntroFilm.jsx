import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/I18n.jsx'
import { img } from '../content.js'
import { Speak } from '../components/Sound.jsx'

// A short animated opening made from LFB's own art: slow movement over each
// picture, cross-fades and one line of text per scene. From storm to sun, the
// same weather language as the check-in. Plays on first visit after choosing a
// language; can be skipped at any time and switched off in the demo settings.
const SCENES = [
  { img: 'weather-storm.jpg', text: 'film.1', move: 'pan-left' },
  { img: 'story-quiet-1.jpg', text: 'film.2', move: 'zoom-in', panel: true },
  { img: 'story-shut-2.jpg', text: 'film.3', move: 'zoom-in', panel: true },
  { img: 'weather-breaking.jpg', text: 'film.4', move: 'pan-right' },
  { img: 'friends.png', text: 'film.5', move: 'float', cutout: true },
  { img: 'weather-clear.jpg', text: 'film.6', move: 'zoom-out' },
]
const SCENE_MS = 5500

export default function IntroFilm({ onDone }) {
  const { t } = useI18n()
  const [i, setI] = useState(0)
  // Once someone taps, they set the pace themselves.
  const [manual, setManual] = useState(false)
  const last = i === SCENES.length - 1
  const scene = SCENES[i]

  useEffect(() => {
    if (manual || last) return
    const id = setTimeout(() => setI((n) => n + 1), SCENE_MS)
    return () => clearTimeout(id)
  }, [i, manual, last])

  const advance = () => {
    setManual(true)
    if (!last) setI(i + 1)
  }

  return (
    <section className="film" aria-roledescription="intro">
      <div className="film-progress" aria-hidden="true">
        {SCENES.map((_, n) => (
          <span key={n} className={n < i ? 'past' : n === i ? (manual ? 'active manual' : 'active') : ''} />
        ))}
      </div>
      <button className="film-skip" onClick={onDone}>
        {t('common.skip')}
      </button>
      <div className="film-stage" onClick={advance}>
        {/* key restarts the movement and fade for each scene */}
        <div key={i} className={`film-scene ${scene.cutout ? 'cutout' : ''} ${scene.panel ? 'panel' : ''}`}>
          <img className={`film-img move-${scene.move}`} src={img(scene.img)} alt="" />
          <p className="film-text">
            {t(scene.text)} <Speak text={t(scene.text)} />
          </p>
        </div>
      </div>
      {last ? (
        <button className="btn btn-primary film-start" onClick={onDone}>
          {t('common.start')}
        </button>
      ) : (
        <p className="film-hint">{t('film.tap')}</p>
      )}
    </section>
  )
}
