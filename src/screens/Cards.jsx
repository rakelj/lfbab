import { useI18n } from '../i18n/I18n.jsx'
import { RIGHTS_CARDS } from '../content.js'
import { Speak } from '../components/Sound.jsx'

export function CardList({ cards }) {
  const { t } = useI18n()
  if (!cards.length) return <p className="muted">{t('cards.empty')}</p>
  return (
    <div className="rights-cards">
      {cards.map((id) => (
        <div key={id} className="rights-card">
          <img src={RIGHTS_CARDS[id].img} alt="" />
          <p>
            {t(RIGHTS_CARDS[id].text)} <Speak text={t(RIGHTS_CARDS[id].text)} />
          </p>
        </div>
      ))}
    </div>
  )
}

export default function Cards({ cards, onBack }) {
  const { t } = useI18n()
  return (
    <section className="screen">
      <h1>
        {t('cards.title')} <Speak text={[t('cards.title'), ...(cards.length ? cards.map((id) => t(RIGHTS_CARDS[id].text)) : [t('cards.empty')])].join('. ')} />
      </h1>
      <CardList cards={cards} />
      <div className="actions">
        <button className="btn btn-primary" onClick={onBack}>
          {t('common.toHub')}
        </button>
      </div>
    </section>
  )
}
