import { useI18n } from '../i18n/I18n.jsx'
import { RIGHTS_CARDS, img } from '../content.js'
import { CardList } from './Cards.jsx'
import { Speak } from '../components/Sound.jsx'

export default function Closing({ progress, onBack }) {
  const { t } = useI18n()

  return (
    <section className="screen">
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
