import { useState } from 'react'
import { useI18n } from '../i18n/I18n.jsx'
import Dots from '../components/Dots.jsx'
import { img } from '../content.js'
import { Speak } from '../components/Sound.jsx'

const PAGES = [
  { n: 1, img: img('sunny-tree.png') },
  { n: 2, img: img('logo.png') },
  { n: 3, img: img('icon-care.png') },
  { n: 4, img: img('thumbs-up.png') },
]

export default function Intro({ onDone }) {
  const { t } = useI18n()
  const [i, setI] = useState(0)
  const page = PAGES[i]
  const last = i === PAGES.length - 1

  return (
    <section className="screen">
      <img className="illustration" src={page.img} alt="" />
      <h1>
        {t(`intro.${page.n}.title`)} <Speak text={`${t(`intro.${page.n}.title`)} ${t(`intro.${page.n}.text`)}`} />
      </h1>
      <p className="lead">{t(`intro.${page.n}.text`)}</p>
      <Dots count={PAGES.length} current={i} />
      <div className="actions">
        {i > 0 && (
          <button className="btn btn-secondary" onClick={() => setI(i - 1)}>
            {t('common.back')}
          </button>
        )}
        <button className="btn btn-primary" onClick={() => (last ? onDone() : setI(i + 1))}>
          {last ? t('common.start') : t('common.next')}
        </button>
      </div>
    </section>
  )
}
