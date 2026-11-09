import { useState } from 'react'
import { useI18n } from '../i18n/I18n.jsx'
import { img } from '../content.js'
import { Speak } from '../components/Sound.jsx'
import { useBack, STEP } from '../nav.js'

// A short animated opening: slow movement over each picture, cross-fades and
// one line of text per scene, from storm to sun. Plays on first visit after
// choosing a language. Each scene stays until you go on, so there is time to
// read; Back and Next step through it, and it can be skipped at any time or
// switched off in the demo settings.
const SCENES = [
  { img: 'weather-storm.jpg', text: 'film.1', move: 'pan-left' },
  { img: 'story-quiet-1.jpg', text: 'film.2', move: 'zoom-in', panel: true },
  { img: 'story-shut-2.jpg', text: 'film.3', move: 'zoom-in', panel: true },
  { img: 'weather-breaking.jpg', text: 'film.4', move: 'pan-right' },
  { img: 'friends.webp', text: 'film.5', move: 'float', cutout: true },
  { img: 'weather-clear.jpg', text: 'film.6', move: 'zoom-out' },
]

export default function IntroFilm({ onDone }) {
  const { t } = useI18n()
  const [i, setI] = useState(0)
  const last = i === SCENES.length - 1
  const scene = SCENES[i]
  const next = () => (last ? onDone() : setI(i + 1))
  useBack(STEP, () => (setI(i - 1), true), i > 0)

  return (
    <section className="film" aria-roledescription="intro">
      <div className="film-progress" aria-hidden="true">
        {SCENES.map((_, n) => (
          <span key={n} className={n < i ? 'past' : n === i ? 'active manual' : ''} />
        ))}
      </div>
      <button className="film-skip" onClick={onDone}>
        {t('common.skip')}
      </button>
      <div className="film-stage" onClick={() => !last && next()}>
        {/* key restarts the movement and fade for each scene */}
        <div key={i} className={`film-scene ${scene.cutout ? 'cutout' : ''} ${scene.panel ? 'panel' : ''}`}>
          <img className={`film-img move-${scene.move}`} src={img(scene.img)} alt="" />
          <p className="film-text">
            {t(scene.text)} <Speak text={t(scene.text)} />
          </p>
        </div>
      </div>
      <div className="actions film-actions">
        {i > 0 && (
          <button className="btn btn-secondary" onClick={() => setI(i - 1)}>
            {t('common.back')}
          </button>
        )}
        <button className="btn btn-primary" onClick={next}>
          {last ? t('common.start') : t('common.next')}
        </button>
      </div>
    </section>
  )
}
