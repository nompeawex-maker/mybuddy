import { useEffect, useState } from 'react'
import './App.css'

const actions = {
  signup: 'เปิดหน้าสร้างบัญชี',
  family: 'เปิดหน้าสำหรับครอบครัว',
  menu: 'เปิดเมนูหลัก',
}

const navItems = [
  { icon: '⌂', label: 'หน้าหลัก', active: true },
  { icon: '⌖', label: 'ติดตามพิกัด' },
  { icon: '17', label: 'พบแพทย์' },
  { icon: '♧', label: 'กิจกรรมร่วมกลุ่ม' },
  { icon: '♩', label: 'ปรึกษาแพทย์' },
]

function MemberHome() {
  const [notice, setNotice] = useState('')

  const notify = (text) => {
    setNotice(text)
    window.setTimeout(() => setNotice(''), 1800)
  }

  return (
    <main className="member-page">
      <section className="member-shell" aria-label="หน้าหลัก MyBuddy+">
        <header className="member-header">
          <button className="brand-button" type="button" onClick={() => { window.location.hash = '' }} aria-label="กลับหน้าต้อนรับ">
            <span className="brand-mark">B⁺</span>
            <span className="brand-copy"><strong>MyBuddy+</strong><small>เพื่อนที่เข้าใจ...สิ่งที่มีความหมาย</small></span>
          </button>
          <button className="sos-button" type="button" onClick={() => notify('กำลังเตรียมโทรฉุกเฉิน')} aria-label="โทรฉุกเฉิน SOS">
            <span>☎</span><strong>SOS</strong>
          </button>
        </header>

        <section className="welcome-card">
          <div className="care-pill"><span>👵👴</span> พอร์ทัลดูแลส่วนบุคคลเพื่อผู้สูงอายุ</div>
          <div className="flower-field" aria-hidden="true">
            <span className="flower flower-one">🌼</span>
            <span className="flower flower-two">🌻</span>
            <span className="flower flower-three">🌼</span>
            <span className="flower flower-four">🌻</span>
            <span className="flower flower-five">🌼</span>
          </div>
          <div className="welcome-copy">
            <h1>สวัสดีค่ะ</h1>
            <p>วันนี้อากาศสดใส สุขภาพร่างกายแข็งแรงดีนะคะ หากรู้สึกไม่สบายตัว ปรึกษาหมอหรือเลือกใช้งานเมนูด้านล่างได้เลยค่ะ</p>
          </div>
        </section>

        <section className="quick-section" aria-labelledby="quick-title">
          <h2 id="quick-title"><span>📱</span> เมนูการใช้งานด่วน <small>(ขนาดใหญ่ เข้าใจง่าย)</small></h2>
          <div className="quick-grid">
            <button type="button" onClick={() => notify('เปิดติดตามพิกัด')}>📍<span>ติดตามพิกัด</span></button>
            <button type="button" onClick={() => notify('เปิดนัดหมายแพทย์')}>📅<span>นัดหมายแพทย์</span></button>
            <button type="button" onClick={() => notify('เปิดกิจกรรม')}>🫂<span>กิจกรรม</span></button>
            <button type="button" onClick={() => notify('เปิดปรึกษาแพทย์')}>🩺<span>ปรึกษาแพทย์</span></button>
          </div>
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
        <button className="hotspot login" type="button" onClick={() => { window.location.hash = 'home' }}><span className="sr-only">เข้าสู่ระบบ</span></button>
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

  return route === '#home' ? <MemberHome /> : <LandingPage />
}

export default App
