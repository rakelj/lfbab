import { useI18n } from '../i18n/I18n.jsx'

// Progress dots. With `onSelect` each dot is a button that jumps to that step.
export default function Dots({ count, current, onSelect }) {
  const { t } = useI18n()
  const cls = (i) => (i === current ? 'active' : i < current ? 'past' : '')
  if (!onSelect) {
    return (
      <div className="dots" aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className={cls(i)} />
        ))}
      </div>
    )
  }
  return (
    <nav className="dots dots-nav">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          className={cls(i)}
          aria-label={t('nav.step', { n: i + 1 })}
          aria-current={i === current ? 'step' : undefined}
          onClick={() => i !== current && onSelect(i)}
        >
          <span />
        </button>
      ))}
    </nav>
  )
}
