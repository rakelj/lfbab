import { useI18n } from '../i18n/I18n.jsx'
import { RIGHTS_CARDS, WEATHER, img } from '../content.js'
import { CardList } from './Cards.jsx'
import { useFeatures } from '../features.jsx'
import { Speak } from '../components/Sound.jsx'

const weather = (id) => WEATHER.find((w) => w.id === id)

export default function Closing({ progress, onBack }) {
  const { t } = useI18n()
  const { on } = useFeatures()
  // Before/after weather only when both check-ins are switched on.
  const both = on('checkin') && on('checkout')
  const before = both && weather(progress.checkin)
  const after = both && weather(progress.checkout)

  return (
    <section className="screen">
      {before && after && (
        <div className="weather-compare" aria-hidden="true">
          <img src={before.img} alt="" />
          <span className="dir-arrow">→</span>
          <img src={after.img} alt="" />
        </div>
      )}
      <h1>
        {t('closing.title')} <Speak text={[t('closing.title'), ...[1, 2, 3, 4, 5, 6].map((n) => t(`closing.${n}`))].join('. ')} />
      </h1>
      <ul className="summary">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <li key={n}>{t(`closing.${n}`)}</li>
        ))}
      </ul>
      <h2>
        {t('cards.title')} <Speak text={[t('cards.title'), ...progress.cards.map((id) => t(RIGHTS_CARDS[id].text))].join('. ')} />
      </h2>
      <CardList cards={progress.cards} />
      <img className="illustration" src={img('friends.png')} alt="" />
      <p>
        {t('closing.contact')} <Speak text={`${t('closing.contact')} ${t('closing.thanks')}`} />
      </p>
      <p className="reassure">{t('closing.thanks')}</p>
      <div className="actions">
        <button className="btn btn-primary" onClick={onBack}>
          {t('common.toHub')}
        </button>
      </div>
    </section>
  )
}
