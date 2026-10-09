import { useI18n } from '../i18n/I18n.jsx'
import { WEATHER } from '../content.js'

export default function WeatherPicker({ value, onChange }) {
  const { t } = useI18n()
  return (
    <div className="weather-grid">
      {WEATHER.map((w) => (
        <button
          key={w.id}
          className={`weather-option ${value === w.id ? 'selected' : ''}`}
          onClick={() => onChange(w.id)}
          aria-pressed={value === w.id}
        >
          <img src={w.img} alt={t(w.label)} />
        </button>
      ))}
    </div>
  )
}
