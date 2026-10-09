export default function Dots({ count, current }) {
  return (
    <div className="dots" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={i === current ? 'active' : i < current ? 'past' : ''} />
      ))}
    </div>
  )
}
