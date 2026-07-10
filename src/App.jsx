import { useState } from 'react'
import './App.css'

const actions = {
  login: 'เปิดหน้าเข้าสู่ระบบ',
  signup: 'เปิดหน้าสร้างบัญชี',
  family: 'เปิดหน้าสำหรับครอบครัว',
  menu: 'เปิดเมนูหลัก',
}

function App() {
  const [message, setMessage] = useState('')
  const landingImage = `${import.meta.env.BASE_URL}mybuddy-landing.png`

  const activate = (action) => {
    setMessage(actions[action])
    window.setTimeout(() => setMessage(''), 1800)
  }

  return (
    <main className="landing-page" style={{ '--landing-image': `url(${landingImage})` }}>
      <section className="poster" aria-label="MyBuddy+ แอปสำหรับผู้สูงอายุ">
        <img
          src={landingImage}
          alt="MyBuddy+ เพื่อนวัยเดียวกันไม่เหงาอีกต่อไป แอปที่ช่วยให้ผู้สูงอายุเชื่อมต่อ หาเพื่อน และดูแลสุขภาพง่ายขึ้น"
        />

        <button className="hotspot menu" type="button" onClick={() => activate('menu')}>
          <span className="sr-only">เปิดเมนูหลัก</span>
        </button>
        <button className="hotspot login" type="button" onClick={() => activate('login')}>
          <span className="sr-only">เข้าสู่ระบบ</span>
        </button>
        <button className="hotspot signup" type="button" onClick={() => activate('signup')}>
          <span className="sr-only">สร้างบัญชี</span>
        </button>
        <button className="hotspot family" type="button" onClick={() => activate('family')}>
          <span className="sr-only">สำหรับครอบครัว</span>
        </button>

        <p className={`toast ${message ? 'show' : ''}`} role="status" aria-live="polite">
          {message}
        </p>
      </section>
    </main>
  )
}

export default App
