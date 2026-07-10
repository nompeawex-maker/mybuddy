import { useEffect, useState } from 'react'
import './App.css'

const actions = {
  signup: 'เปิดหน้าสร้างบัญชี',
  family: 'เปิดหน้าสำหรับครอบครัว',
  menu: 'เปิดเมนูหลัก',
}

function IconPhone() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M16.5 9.5 22 15c1.1 1.1 1.1 2.9 0 4l-2.1 2.1c2 4.4 5.6 8 10 10l2.1-2.1c1.1-1.1 2.9-1.1 4 0l5.5 5.5c.7.7.8 1.8.2 2.6-1.7 2.5-4.7 4.4-8.1 4.4-15 0-27.1-12.1-27.1-27.1 0-3.4 1.9-6.4 4.4-8.1.8-.6 1.9-.5 2.6.2z" />
    </svg>
  )
}

function BrandIcon() {
  const logo = `${import.meta.env.BASE_URL}mybuddy-logo.png`

  return (
    <span className="brand-mark">
      <img src={logo} alt="" aria-hidden="true" />
    </span>
  )
}

function ElderIcon() {
  return (
    <span className="elder-icon" aria-hidden="true">
      <span className="elder elder-woman">
        <span className="elder-hair" />
        <span className="elder-face"><i /><b /></span>
        <span className="elder-body" />
      </span>
      <span className="elder elder-man">
        <span className="elder-hair" />
        <span className="elder-face"><i /><b /></span>
        <span className="elder-body" />
      </span>
    </span>
  )
}

function PhoneMenuIcon() {
  return (
    <span className="phone-menu-icon" aria-hidden="true">
      {Array.from({ length: 18 }).map((_, index) => <i key={index} />)}
    </span>
  )
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M6 24.6 24 9l18 15.6v17.2a2.2 2.2 0 0 1-2.2 2.2H29V31H19v13H8.2A2.2 2.2 0 0 1 6 41.8V24.6z" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M23.7 5.5c-7.1 0-12.8 5.7-12.8 12.8 0 9.6 12.8 21.5 12.8 21.5s12.8-11.9 12.8-21.5c0-7.1-5.7-12.8-12.8-12.8zm0 17.4a4.8 4.8 0 1 1 0-9.6 4.8 4.8 0 0 1 0 9.6z" fill="none" stroke="currentColor" strokeWidth="3.2" />
      <path d="M10.2 33.9c-3.2 1.2-5.2 2.9-5.2 4.7 0 3.1 8.5 5.6 19 5.6s19-2.5 19-5.6c0-1.6-2.2-3.1-5.8-4.2" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M32.9 31.5c3.4-.4 5.6-.2 6.8.6 1.2.8 1 1.9-.7 3.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="2.2 4" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <rect x="9" y="10" width="30" height="31" rx="3" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M9 18h30M17 6v8M31 6v8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <text x="24" y="34" textAnchor="middle" fontSize="16" fontWeight="900" fill="currentColor">17</text>
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="16" r="6" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="12.5" cy="19" r="5" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="35.5" cy="19" r="5" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M13 37c1.8-6 5.4-9 11-9s9.2 3 11 9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M4.8 37c1.1-4.5 3.8-6.8 8.2-6.8M35 30.2c4.4 0 7.1 2.3 8.2 6.8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function StethoscopeIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M13 8v12c0 6.2 4 10.5 9 10.5s9-4.3 9-10.5V8" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M22 30.5v3.8c0 5.4 4.1 8.7 9.2 8.7 4.8 0 8.3-3.2 8.3-7.6" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="39.5" cy="32.2" r="4.2" fill="none" stroke="currentColor" strokeWidth="3.4" />
      <path d="M9 8h4M31 8h4" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  )
}

const navItems = [
  { icon: <HomeIcon />, label: 'หน้าหลัก', active: true },
  { icon: <LocationIcon />, label: 'ติดตามพิกัด' },
  { icon: <CalendarIcon />, label: 'หมอนัด' },
  { icon: <UsersIcon />, label: 'กิจกรรมร่วมกลุ่ม' },
  { icon: <StethoscopeIcon />, label: 'ปรึกษาแพทย์' },
]

function MemberHome() {
  const [notice, setNotice] = useState('')
  const homeBg = `${import.meta.env.BASE_URL}mybuddy-home-bg.png`

  const notify = (text) => {
    setNotice(text)
    window.setTimeout(() => setNotice(''), 1800)
  }

  return (
    <main className="member-page">
      <section className="member-shell" aria-label="หน้าหลัก MyBuddy+">
        <header className="member-header">
          <button className="brand-button" type="button" onClick={() => { window.location.hash = '' }} aria-label="กลับหน้าต้อนรับ">
            <BrandIcon />
            <span className="brand-copy">
              <strong>MyBuddy+</strong>
              <small>เพื่อนที่เข้าใจ...วัยที่มีความหมาย</small>
            </span>
          </button>
          <button className="sos-button" type="button" onClick={() => notify('กำลังเตรียมโทรฉุกเฉิน')} aria-label="โทรฉุกเฉิน SOS">
            <IconPhone /><strong>SOS</strong>
          </button>
        </header>

        <section className="welcome-card" style={{ '--home-bg': `url(${homeBg})` }}>
          <div className="care-row">
            <ElderIcon />
            <div className="care-pill">พอร์ทัลดูแลส่วนบุคคลเพื่อผู้สูงอายุ</div>
          </div>

          <div className="welcome-copy">
            <h1>สวัสดีค่ะ</h1>
            <p>วันนี้อากาศสดใส สุขภาพร่างกายแข็งแรงดีนะคะ หากรู้สึกไม่สบายตัว ปรึกษาหมอหรือเลือกใช้งานเมนูด้านล่างได้เลยค่ะ</p>
          </div>
        </section>

        <section className="quick-section" aria-labelledby="quick-title">
          <h2 id="quick-title"><PhoneMenuIcon /> เมนูการใช้งานด่วน (ขนาดใหญ่ เข้าใจง่าย)</h2>
        </section>

        <nav className="bottom-nav" aria-label="เมนูหลัก">
          {navItems.map((item) => (
            <button className={item.active ? 'active' : ''} type="button" key={item.label} onClick={() => notify(item.label)}>
              <span>{item.icon}</span><small>{item.label}</small>
            </button>
          ))}
        </nav>

        <p className={`toast member-toast ${notice ? 'show' : ''}`} role="status" aria-live="polite">{notice}</p>
      </section>
    </main>
  )
}

function LoginPage() {
  const loginImage = `${import.meta.env.BASE_URL}mybuddy-login.png`

  return (
    <main className="login-page" style={{ '--login-image': `url(${loginImage})` }}>
      <section className="login-poster" aria-label="เข้าสู่ระบบ MyBuddy+">
        <img src={loginImage} alt="หน้าเข้าสู่ระบบ MyBuddy+" />
        <button className="login-back-hotspot" type="button" onClick={() => { window.location.hash = '' }}>
          <span className="sr-only">กลับหน้าต้อนรับ</span>
        </button>
        <button className="login-submit-hotspot" type="button" onClick={() => { window.location.hash = 'home' }}>
          <span className="sr-only">เข้าสู่ระบบ</span>
        </button>
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
      <section className="poster" aria-label="MyBuddy+ แอปสำหรับผู้สูงอายุ">
        <img src={landingImage} alt="MyBuddy+ เพื่อนวัยเดียวกันไม่เหงาอีกต่อไป" />
        <button className="hotspot menu" type="button" onClick={() => activate('menu')}><span className="sr-only">เปิดเมนูหลัก</span></button>
        <button className="hotspot login" type="button" onClick={() => { window.location.hash = 'login' }}><span className="sr-only">เข้าสู่ระบบ</span></button>
        <button className="hotspot signup" type="button" onClick={() => activate('signup')}><span className="sr-only">สร้างบัญชี</span></button>
        <button className="hotspot family" type="button" onClick={() => activate('family')}><span className="sr-only">สำหรับครอบครัว</span></button>
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

  if (route === '#home') return <MemberHome />
  if (route === '#login') return <LoginPage />
  return <LandingPage />
}

export default App
