import { useState } from 'react'
import { useI18n } from '../i18n/I18n.jsx'
import WeatherPicker from '../components/WeatherPicker.jsx'
import { Speak } from '../components/Sound.jsx'

// Used at the start ("checkin") and at the end ("checkout").
export default function CheckIn({ kind, initial, onDone }) {
  const { t } = useI18n()
  const [choice, setChoice] = useState(initial)

  const finish = () => {
    onDone(choice)
  }

  return (
    <section className="screen">
      <h1>
        {t(`${kind}.title`)} <Speak text={`${t(`${kind}.title`)} ${t(`${kind}.text`)}`} />
      </h1>
      <p className="lead">{t(`${kind}.text`)}</p>
      <WeatherPicker value={choice} onChange={setChoice} />
      {choice && <p className="reassure">{t('checkin.thanks')}</p>}
      <div className="actions">
        {!choice && (
          <button className="btn btn-secondary" onClick={() => onDone(null)}>
            {t('common.skip')}
          </button>
        )}
        <button className="btn btn-primary" disabled={!choice} onClick={finish}>
          {t('common.next')}
        </button>
      </div>
    </section>
  )
}
