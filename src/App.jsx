import { useEffect, useState } from 'react'
import './App.css'

const actions = {
  signup: 'Open sign up',
  family: 'Open family page',
  menu: 'Open main menu',
}

const navItems = [
  { label: 'Home' },
  { label: 'Location' },
  { label: 'Appointment' },
  { label: 'Activities' },
  { label: 'Consult doctor' },
]

function MemberHome() {
  const [notice, setNotice] = useState('')
  const homeImage = `${import.meta.env.BASE_URL}mybuddy-home.png`

  const notify = (text) => {
    setNotice(text)
    window.setTimeout(() => setNotice(''), 1800)
  }

  return (
    <main className="member-page" style={{ '--member-image': `url(${homeImage})` }}>
      <section className="member-poster" aria-label="MyBuddy+ home">
        <img src={homeImage} alt="MyBuddy+ home screen" />
        <button className="member-hotspot member-brand" type="button" onClick={() => { window.location.hash = '' }}>
          <span className="sr-only">Back to landing</span>
        </button>
        <button className="member-hotspot member-sos" type="button" onClick={() => notify('SOS')}>
          <span className="sr-only">SOS</span>
        </button>
        {navItems.map((item, index) => (
          <button
            className={`member-hotspot member-nav member-nav-${index + 1}`}
            type="button"
            key={item.label}
            onClick={() => notify(item.label)}
          >
            <span className="sr-only">{item.label}</span>
          </button>
        ))}
        <p className={`toast member-toast ${notice ? 'show' : ''}`} role="status" aria-live="polite">{notice}</p>
      </section>
    </main>
  )
}

function LandingPage() {
  const [message, setMessage] = useState('')
  const landingImage = `${import.meta.env.BASE_URL}mybuddy-landing.png`

  const activate = (action) => {
    setMessage(actions[action])
    window.setTimeout(() => setMessage(''), 1800)
  }

  return (
    <main className="landing-page" style={{ '--landing-image': `url(${landingImage})` }}>
      <section className="poster" aria-label="MyBuddy+ app for older adults">
        <img src={landingImage} alt="MyBuddy+ landing screen" />
        <button className="hotspot menu" type="button" onClick={() => activate('menu')}><span className="sr-only">Open main menu</span></button>
        <button className="hotspot login" type="button" onClick={() => { window.location.hash = 'home' }}><span className="sr-only">Log in</span></button>
        <button className="hotspot signup" type="button" onClick={() => activate('signup')}><span className="sr-only">Sign up</span></button>
        <button className="hotspot family" type="button" onClick={() => activate('family')}><span className="sr-only">Family page</span></button>
        <p className={`toast ${message ? 'show' : ''}`} role="status" aria-live="polite">{message}</p>
      </section>
    </main>
  )
}

function App() {
  const [route, setRoute] = useState(window.location.hash)

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return route === '#home' ? <MemberHome /> : <LandingPage />
}

export default App
