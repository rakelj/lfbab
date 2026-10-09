import { useI18n } from '../i18n/I18n.jsx'
import { WEATHER, img } from '../content.js'
import { CardList } from './Cards.jsx'

const weather = (id) => WEATHER.find((w) => w.id === id)

export default function Closing({ progress, onBack }) {
  const { t } = useI18n()
  const before = weather(progress.checkin)
  const after = weather(progress.checkout)

  return (
    <section className="screen">
      {before && after && (
        <div className="weather-compare" aria-hidden="true">
          <img src={before.img} alt="" />
          <span>→</span>
          <img src={after.img} alt="" />
        </div>
      )}
      <h1>{t('closing.title')}</h1>
      <ul className="summary">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <li key={n}>{t(`closing.${n}`)}</li>
        ))}
      </ul>
      <h2>{t('cards.title')}</h2>
      <CardList cards={progress.cards} />
      <img className="illustration" src={img('friends.png')} alt="" />
      <p>{t('closing.contact')}</p>
      <p className="reassure">{t('closing.thanks')}</p>
      <div className="actions">
        <button className="btn btn-primary" onClick={onBack}>
          {t('common.toHub')}
        </button>
      </div>
    </section>
  )
}
