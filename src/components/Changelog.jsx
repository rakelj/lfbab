import { useState } from 'react'
import { CHANGELOG } from '../changelog.js'
import Modal from './Modal.jsx'

const SEEN_KEY = 'lfb-changelog-seen'
const latest = CHANGELOG[0].version

function readSeen() {
  try {
    return localStorage.getItem(SEEN_KEY)
  } catch {
    return null
  }
}

// Demo mode only: the version stamp opens "Hva er nytt". Shows "Nytt" until
// the newest entry has been opened on this device.
export default function Changelog({ stamp }) {
  const [open, setOpen] = useState(false)
  const [seen, setSeen] = useState(readSeen)

  const show = () => {
    setOpen(true)
    setSeen(latest)
    try {
      localStorage.setItem(SEEN_KEY, latest)
    } catch {}
  }

  return (
    <>
      <footer className="build-stamp">
        <button className="btn-link build-stamp-link" onClick={show}>
          {stamp} · Hva er nytt?
        </button>
        {seen !== latest && <span className="new-badge">Nytt</span>}
      </footer>
      {open && (
        <Modal title="Hva er nytt" className="changelog" onClose={() => setOpen(false)}>
          {CHANGELOG.map((v) => (
            <section key={v.version} className="changelog-version">
              <h3>
                v{v.version} <span className="muted">· {v.date}</span>
              </h3>
              {v.title && <p className="muted">{v.title}</p>}
              <ul>
                {v.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </Modal>
      )}
    </>
  )
}
