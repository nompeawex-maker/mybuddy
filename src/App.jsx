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
      <span className="elder elder-woman"><span className="elder-hair" /><span className="elder-face"><i /><b /></span><span className="elder-body" /></span>
      <span className="elder elder-man"><span className="elder-hair" /><span className="elder-face"><i /><b /></span><span className="elder-body" /></span>
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
  return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 24.6 24 9l18 15.6v17.2a2.2 2.2 0 0 1-2.2 2.2H29V31H19v13H8.2A2.2 2.2 0 0 1 6 41.8V24.6z" /></svg>
}

function MatchIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="16" cy="17" r="7" fill="none" stroke="currentColor" strokeWidth="3.2" />
      <circle cx="32" cy="17" r="7" fill="none" stroke="currentColor" strokeWidth="3.2" />
      <path d="M5.5 39c1.7-7.2 5.2-10.8 10.5-10.8 4.3 0 7.3 2.4 9.1 7.2M22.9 35.4c1.8-4.8 4.8-7.2 9.1-7.2 5.3 0 8.8 3.6 10.5 10.8" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M22.4 12.9c1.1-2.1 2.1-3.1 3.1-3.1 1.8 0 3.2 2.2 1.1 4.4l-4.2 4.1-4.2-4.1c-2.1-2.2-.7-4.4 1.1-4.4 1 0 2 1 3.1 3.1z" fill="currentColor" />
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
  { icon: <MatchIcon />, label: 'Buddy', route: 'match' },
  { icon: <CalendarIcon />, label: 'หมอนัด', route: 'appointments' },
  { icon: <UsersIcon />, label: 'กิจกรรมร่วมกลุ่ม', route: 'activities' },
  { icon: <StethoscopeIcon />, label: 'ปรึกษาแพทย์', route: 'consult' },
]

const activityImages = [
  { src: 'activity-yoga.png', alt: 'กิจกรรมฝึกสมาธิและโยคะ' },
  { src: 'activity-cooking.png', alt: 'กิจกรรมห้องเรียนทำอาหารคลีน' },
  { src: 'activity-nature.png', alt: 'กิจกรรมทริปเดินชมธรรมชาติศึกษาพรรณไม้' },
]

const homeRecommendations = [
  { src: 'home-recommend-brain.jpg', alt: 'แนะนำกิจกรรมฝึกสมองป้องกันความจำเสื่อม' },
  { src: 'home-recommend-health.jpg', alt: 'บทความอาหารสุขภาพและวิธีฝึกสมาธิ' },
]

function MemberHome() {
  const [notice, setNotice] = useState('')
  const homeBg = `${import.meta.env.BASE_URL}mybuddy-home-bg.png`

  const notify = (text) => {
    setNotice(text)
    window.setTimeout(() => setNotice(''), 1800)
  }

  const handleNav = (item) => {
    if (item.route) {
      window.location.hash = item.route
      return
    }
    notify(item.label)
  }

  return (
    <main className="member-page">
      <section className="member-shell" aria-label="หน้าหลัก MyBuddy+">
        <header className="member-header">
          <button className="brand-button" type="button" onClick={() => { window.location.hash = '' }} aria-label="กลับหน้าต้อนรับ">
            <BrandIcon />
            <span className="brand-copy"><strong>MyBuddy+</strong><small>เพื่อนที่เข้าใจ...วัยที่มีความหมาย</small></span>
          </button>
          <button className="sos-button" type="button" onClick={() => { window.location.hash = 'sos' }} aria-label="โทรฉุกเฉิน SOS">
            <IconPhone /><strong>SOS</strong>
          </button>
        </header>

        <section className="welcome-card" style={{ '--home-bg': `url(${homeBg})` }}>
          <div className="care-row">
            <ElderIcon />
            <div className="care-pill">MyBuddyพร้อมดูแลคุณผู้ชาย/คุณผู้หญิง</div>
          </div>
          <div className="welcome-copy">
            <h1>สวัสดีค่ะ</h1>
            <p>วันนี้อากาศสดใส สุขภาพร่างกายแข็งแรงดีนะคะ หากรู้สึกไม่สบายตัว ปรึกษาหมอหรือเลือกใช้งานเมนูด้านล่างได้เลยค่ะ</p>
          </div>
        </section>

        <section className="recommend-section" aria-labelledby="recommend-title">
          <h2 id="recommend-title">🌟 แนะนำสำหรับคุณ</h2>
          <div className="recommend-list">
            {homeRecommendations.map((item) => (
              <button className="recommend-card" type="button" key={item.src} onClick={() => notify('เปิดบทความแนะนำ')}>
                <img src={`${import.meta.env.BASE_URL}${item.src}`} alt={item.alt} />
              </button>
            ))}
          </div>
        </section>

        <nav className="bottom-nav" aria-label="เมนูหลัก">
          {navItems.map((item) => (
            <button className={item.active ? 'active' : ''} type="button" key={item.label} onClick={() => handleNav(item)}>
              <span>{item.icon}</span><small>{item.label}</small>
            </button>
          ))}
        </nav>

        <p className={`toast member-toast ${notice ? 'show' : ''}`} role="status" aria-live="polite">{notice}</p>
      </section>
    </main>
  )
}

function ActivitiesPage() {
  return (
    <main className="activities-page">
      <section className="activities-shell" aria-label="กิจกรรมร่วมกลุ่ม">
        <header className="activities-header">
          <button type="button" onClick={() => { window.location.hash = 'home' }} aria-label="กลับหน้าหลัก">‹</button>
          <div>
            <strong>กิจกรรมร่วมกลุ่ม</strong>
            <small>เลื่อนเลือกกิจกรรมที่สนใจได้เลย</small>
          </div>
        </header>
        <div className="activity-list">
          {activityImages.map((activity) => (
            <article className="activity-card" key={activity.src}>
              <img src={`${import.meta.env.BASE_URL}${activity.src}`} alt={activity.alt} />
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

const firstAppointment = {
  hospital: 'โรงพยาบาลรามาธิบดี',
  doctor: 'คุณหมอเวร: นพ. สมชาย รักดี (แผนกโรคหัวใจ)',
  type: 'เดินทางไปพบแพทย์ ณ โรงพยาบาล',
  date: 'วันพุธที่ 15 กรกฎาคม 2569',
  time: '09:00 น.',
  note: 'ตรวจเลือดประจำปี กรุณางดน้ำและอาหารหลังเที่ยงคืน',
  phone: '02-201-1000',
}

function AppointmentCard({ appointment, isNewest }) {
  return (
    <article className="appointment-card">
      <div className="appointment-badges">
        <span className="nearest-badge">📣 นัดหมายถัดไปใกล้ที่สุด</span>
        {isNewest && <span className="important-badge">🚨 บันทึกสำคัญ</span>}
      </div>
      <h2>{appointment.hospital}</h2>
      <p className="doctor-line">👨‍⚕️ {appointment.doctor}</p>
      <p className="visit-pill">🏥 {appointment.type}</p>
      <div className="appointment-detail-box">
        <div className="detail-icon">📅</div>
        <div>
          <small>วันที่ระบุนัด</small>
          <strong>{appointment.date}</strong>
        </div>
        <div className="detail-icon">🕘</div>
        <div>
          <small>เวลาที่กำหนด</small>
          <strong>{appointment.time}</strong>
        </div>
      </div>
      <p className="appointment-note">ⓘ ข้อแนะนำ: {appointment.note}</p>
      <a className="hospital-call" href={`tel:${appointment.phone.replaceAll('-', '')}`}>📞 เบอร์โรงพยาบาลฉุกเฉิน: {appointment.phone}</a>
    </article>
  )
}

function AppointmentsPage() {
  const [appointments, setAppointments] = useState([firstAppointment])
  const [notice, setNotice] = useState('')

  const addAppointment = () => {
    const count = appointments.length + 1
    setAppointments([
      {
        hospital: 'โรงพยาบาลรามาธิบดี',
        doctor: 'คุณหมอเวร: นพ. สมชาย รักดี (แผนกโรคหัวใจ)',
        type: 'ปรึกษาแพทย์ทางไกลผ่านช่องทางออนไลน์',
        date: `วันศุกร์ที่ ${15 + count} กรกฎาคม 2569`,
        time: count % 2 === 0 ? '13:30 น.' : '10:00 น.',
        note: 'เตรียมผลตรวจล่าสุดและรายการยาที่ใช้อยู่ก่อนพบแพทย์',
        phone: '02-201-1000',
      },
      ...appointments,
    ])
    setNotice('เพิ่มนัดหมายใหม่แล้ว')
    window.setTimeout(() => setNotice(''), 1800)
  }

  return (
    <main className="appointments-page">
      <section className="appointments-shell" aria-label="ระบบตารางนัดหมายและปรึกษาแพทย์">
        <header className="appointments-header">
          <button type="button" onClick={() => { window.location.hash = 'home' }} aria-label="กลับหน้าหลัก">‹</button>
          <div>
            <strong>หมอนัด</strong>
            <small>จัดการตารางนัดหมายและปรึกษาแพทย์</small>
          </div>
        </header>

        <section className="appointment-intro">
          <div className="intro-title">
            <span>📅</span>
            <h1>ระบบตารางนัดหมาย & ปรึกษาแพทย์</h1>
          </div>
          <p>จัดการวันนัดพบหมอที่โรงพยาบาล และจองช่วงเวลาปรึกษาแพทย์ทางไกลผ่านช่องทางต่าง ๆ</p>
          <button type="button" onClick={addAppointment}>＋ เพิ่มนัดหมายใหม่</button>
        </section>

        <div className="appointment-list">
          {appointments.map((appointment, index) => (
            <AppointmentCard appointment={appointment} isNewest={index === 0} key={`${appointment.date}-${appointment.time}-${index}`} />
          ))}
        </div>
        <p className={`toast member-toast ${notice ? 'show' : ''}`} role="status" aria-live="polite">{notice}</p>
      </section>
    </main>
  )
}

const matchInterests = ['ใกล้ที่สุด', 'เดินเล่น', 'คุยกาแฟ', 'ออกกำลัง', 'ทำกิจกรรม']

const matchProfiles = [
  { name: 'คุณภาคิน', age: 64, role: 'Buddy ใกล้คุณ', note: 'อยู่แถวสวนสาธารณะ ชอบเดินออกกำลัง คุยเรื่องข่าว และนัดดื่มกาแฟช่วงเช้า', distance: '0.8 กม.', pickup: 'คอนโดศาลาแดง', place: 'สวนลุมพินี', image: 'match-profile-60plus.png' },
  { name: 'คุณมาลี', age: 62, role: 'Buddy กิจกรรม', note: 'อยู่ใกล้ศูนย์ชุมชน ชอบทำอาหารสุขภาพและเดินเล่นช่วงเย็น', distance: '1.4 กม.', pickup: 'ศูนย์ชุมชนใกล้บ้าน', place: 'สวนลุมพินี', image: 'match-profile-60plus.png' },
  { name: 'คุณอนงค์', age: 67, role: 'Buddy คุยสบาย ๆ', note: 'อยู่แถวตลาดเช้า สนใจฝึกสมาธิ อ่านหนังสือ และหาเพื่อนคุยประจำวัน', distance: '2.1 กม.', pickup: 'ตลาดเช้า', place: 'สวนลุมพินี', image: 'match-profile-60plus.png' },
]

const buddyRideStops = [
  { label: 'คุณ', place: 'บ้านของคุณ', eta: '0 นาที' },
  { label: 'คุณภาคิน', place: 'คอนโดศาลาแดง', eta: '6 นาที' },
  { label: 'คุณมาลี', place: 'ศูนย์ชุมชนใกล้บ้าน', eta: '11 นาที' },
  { label: 'ปลายทาง', place: 'สวนลุมพินี', eta: '18 นาที' },
]

function MatchPage() {
  const [interest, setInterest] = useState(matchInterests[0])
  const [selectedProfile, setSelectedProfile] = useState(matchProfiles[0])
  const [matchedProfiles, setMatchedProfiles] = useState([])
  const [buddyTab, setBuddyTab] = useState('discover')
  const [rideReady, setRideReady] = useState(false)
  const [notice, setNotice] = useState('')
  const profileImage = `${import.meta.env.BASE_URL}${selectedProfile.image}`
  const groupMembers = [selectedProfile, ...matchedProfiles.filter((profile) => profile.name !== selectedProfile.name)].slice(0, 3)
  const isMatched = groupMembers.some((profile) => profile.name === selectedProfile.name)
  const currentProfileIndex = matchProfiles.findIndex((profile) => profile.name === selectedProfile.name)

  const showNextBuddy = () => {
    const nextIndex = (currentProfileIndex + 1) % matchProfiles.length
    setSelectedProfile(matchProfiles[nextIndex])
    setNotice('เลื่อนไปหา Buddy คนถัดไป')
    window.setTimeout(() => setNotice(''), 1400)
  }

  const startMatch = () => {
    setMatchedProfiles((current) => current.some((profile) => profile.name === selectedProfile.name) ? current : [selectedProfile, ...current])
    setNotice(`จับคู่กับ ${selectedProfile.name} สำเร็จแล้ว`)
    window.setTimeout(() => setNotice(''), 2000)
  }

  const requestRide = () => {
    setRideReady(true)
    setNotice('คำนวณเส้นทางรับ Buddy แล้ว')
    window.setTimeout(() => setNotice(''), 2000)
  }

  const openChat = (tab) => {
    if (!isMatched) startMatch()
    setBuddyTab(tab)
  }

  const ChatRoom = ({ group = false }) => (
    <section className="buddy-chat-room" aria-label={group ? 'ห้องแชทกลุ่ม Buddy' : 'ห้องแชทเดียว Buddy'}>
      <header className="chat-room-head">
        <button type="button" onClick={() => setBuddyTab('discover')} aria-label="กลับหน้า Buddy">‹</button>
        <div>
          <strong>{group ? 'แชทกลุ่ม Buddy' : selectedProfile.name}</strong>
          <small>{group ? `สมาชิก ${groupMembers.length + 1} คน · จุดหมาย ${selectedProfile.place}` : `${selectedProfile.distance} · ${selectedProfile.role}`}</small>
        </div>
      </header>

      <div className="chat-member-strip">
        <span>คุณ</span>
        {(group ? groupMembers : [selectedProfile]).map((profile) => <span key={profile.name}>{profile.name}</span>)}
      </div>

      <div className="chat-thread">
        <p className="system-message">MyBuddy สร้างห้องแชทให้แล้ว สามารถคุยและเรียกรถจากช่องพิมพ์ได้เลย</p>
        <p><b>{selectedProfile.name}:</b> สวัสดีครับ วันนี้สะดวกนัดที่ {selectedProfile.place} ไหมครับ</p>
        {group && <p><b>คุณมาลี:</b> ถ้ามีรถรับหลายจุดจะสะดวกมากค่ะ</p>}
        <p className="my-message">ได้ครับ เดี๋ยวให้แอปช่วยคำนวณรถรับส่งให้</p>
      </div>

      <div className="chat-composer">
        <button type="button" onClick={requestRide}>🚗 เรียกรถ</button>
        <input type="text" placeholder="พิมพ์ข้อความถึง Buddy..." />
        <button type="button" onClick={() => setNotice('ส่งข้อความแล้ว')}>ส่ง</button>
      </div>

      {rideReady && (
        <div className="chat-ride-card">
          <small>MyBuddy Ride</small>
          <strong>คำนวณเส้นทางรับส่งแล้ว</strong>
          <ol>
            {buddyRideStops.map((stop) => (
              <li key={stop.label}><span>{stop.label}</span><b>{stop.place}</b><em>{stop.eta}</em></li>
            ))}
          </ol>
          <button type="button" onClick={() => setNotice('ยืนยันเรียกรถแล้ว')}>ยืนยันเรียกรถ</button>
        </div>
      )}
    </section>
  )

  return (
    <main className="match-page">
      <section className="match-shell" aria-label="ระบบ Buddy ใกล้เคียง MyBuddy">
        <header className="match-header">
          <button type="button" onClick={() => { window.location.hash = 'home' }} aria-label="กลับหน้าหลัก">‹</button>
          <div>
            <strong>Buddy</strong>
            <small>หาเพื่อนบริเวณใกล้เคียงพร้อมระยะทาง</small>
          </div>
        </header>

        {buddyTab === 'discover' && (
          <>
            <section className="match-hero">
              <span>💙</span>
              <h1>หา Buddy ใกล้บ้านคุณ</h1>
              <p>ดูเพื่อนบริเวณใกล้เคียง เลือกคนที่สนใจเหมือนกัน แล้วเปิดแชทเดียวหรือแชทกลุ่มได้จากแถบ Buddy ด้านล่าง</p>
            </section>

            <section className="match-panel" aria-label="ตัวกรอง Buddy ใกล้เคียง">
              <h2>อยากหา Buddy แบบไหน?</h2>
              <div className="interest-list">
                {matchInterests.map((item) => (
                  <button className={interest === item ? 'active' : ''} type="button" key={item} onClick={() => setInterest(item)}>{item}</button>
                ))}
              </div>
            </section>

            <section className="match-panel" aria-label="รายชื่อ Buddy ใกล้คุณ">
              <h2>Buddy ใกล้คุณ</h2>
              <article className="match-swipe-card">
                <img src={profileImage} alt={`${selectedProfile.name} อายุ ${selectedProfile.age} ปี`} />
                <div className="match-card-gradient">
                  <span className="match-score">📍 {selectedProfile.distance}</span>
                  <h3>{selectedProfile.name}, {selectedProfile.age}</h3>
                  <p>{selectedProfile.role}</p>
                  <small>{selectedProfile.note}</small>
                  <small>จุดนัดพบแนะนำ: {selectedProfile.place}</small>
                </div>
              </article>
              <div className="swipe-actions" aria-label="เลือก Buddy">
                <button type="button" onClick={showNextBuddy}>✕</button>
                <button type="button" onClick={startMatch}>♥</button>
              </div>
              <p className="swipe-hint">กด ✕ เพื่อปัดหา Buddy คนใหม่ หรือกด ♥ เพื่อจับคู่</p>
            </section>
          </>
        )}

        {buddyTab === 'single' && <ChatRoom />}
        {buddyTab === 'group' && <ChatRoom group />}

        <nav className="buddy-subnav" aria-label="เมนู Buddy">
          <button className={buddyTab === 'discover' ? 'active' : ''} type="button" onClick={() => setBuddyTab('discover')}>Buddy</button>
          <button className={buddyTab === 'single' ? 'active' : ''} type="button" onClick={() => openChat('single')}>แชทเดียว</button>
          <button className={buddyTab === 'group' ? 'active' : ''} type="button" onClick={() => openChat('group')}>แชทกลุ่ม</button>
        </nav>

        <p className={`toast member-toast ${notice ? 'show' : ''}`} role="status" aria-live="polite">{notice}</p>
      </section>
    </main>
  )
}

const consultationModes = [
  { id: 'video', label: 'วิดีโอคอล', detail: 'พบแพทย์แบบเห็นหน้า', icon: '🎥' },
  { id: 'chat', label: 'แชท', detail: 'ส่งอาการและรูปภาพ', icon: '💬' },
  { id: 'call', label: 'โทรเสียง', detail: 'คุยง่าย ไม่ต้องพิมพ์', icon: '📞' },
]

const doctors = [
  { name: 'พญ. อรณิชา ใจดี', field: 'อายุรกรรม / ผู้สูงอายุ', status: 'พร้อมให้คำปรึกษา', wait: 'รอประมาณ 5 นาที' },
  { name: 'นพ. สมชาย รักดี', field: 'โรคหัวใจ', status: 'ว่างรอบถัดไป', wait: 'วันนี้ 13:30 น.' },
]

function ConsultPage() {
  const [mode, setMode] = useState('video')
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0])
  const [symptom, setSymptom] = useState('')
  const [notice, setNotice] = useState('')

  const activeMode = consultationModes.find((item) => item.id === mode)
  const submitConsult = () => {
    setNotice(symptom.trim() ? 'ส่งคำขอปรึกษาแพทย์แล้ว' : 'เลือกแพทย์และช่องทางแล้ว สามารถพิมพ์อาการเพิ่มได้')
    window.setTimeout(() => setNotice(''), 2200)
  }

  return (
    <main className="consult-page">
      <section className="consult-shell" aria-label="ระบบปรึกษาแพทย์">
        <header className="consult-header">
          <button type="button" onClick={() => { window.location.hash = 'home' }} aria-label="กลับหน้าหลัก">‹</button>
          <div>
            <strong>ปรึกษาแพทย์</strong>
            <small>เลือกช่องทางและแพทย์ที่เหมาะกับคุณ</small>
          </div>
        </header>

        <section className="consult-hero">
          <span className="consult-mark">🩺</span>
          <h1>พบแพทย์ได้จากที่บ้าน</h1>
          <p>เริ่มปรึกษาอาการเบื้องต้น จองคิว หรือเลือกแพทย์เฉพาะทางได้อย่างรวดเร็ว</p>
        </section>

        <section className="consult-panel" aria-label="เลือกช่องทางปรึกษา">
          <h2>ช่องทางปรึกษา</h2>
          <div className="consult-modes">
            {consultationModes.map((item) => (
              <button className={mode === item.id ? 'active' : ''} type="button" key={item.id} onClick={() => setMode(item.id)}>
                <span>{item.icon}</span>
                <strong>{item.label}</strong>
                <small>{item.detail}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="consult-panel" aria-label="เลือกแพทย์">
          <h2>แพทย์ที่พร้อมให้บริการ</h2>
          <div className="doctor-list">
            {doctors.map((doctor) => (
              <button className={selectedDoctor.name === doctor.name ? 'active' : ''} type="button" key={doctor.name} onClick={() => setSelectedDoctor(doctor)}>
                <span className="doctor-avatar">👩‍⚕️</span>
                <span>
                  <strong>{doctor.name}</strong>
                  <small>{doctor.field}</small>
                  <em>{doctor.status} · {doctor.wait}</em>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="consult-panel" aria-label="รายละเอียดอาการ">
          <h2>บอกอาการเบื้องต้น</h2>
          <textarea value={symptom} onChange={(event) => setSymptom(event.target.value)} placeholder="เช่น เวียนหัว เจ็บหน้าอก นอนไม่หลับ หรืออยากปรึกษาเรื่องยา" />
          <div className="consult-summary">
            <span>{activeMode.icon}</span>
            <div>
              <small>ช่องทางที่เลือก</small>
              <strong>{activeMode.label} กับ {selectedDoctor.name}</strong>
            </div>
          </div>
          <button className="consult-submit" type="button" onClick={submitConsult}>เริ่มปรึกษาแพทย์</button>
        </section>

        <p className={`toast member-toast ${notice ? 'show' : ''}`} role="status" aria-live="polite">{notice}</p>
      </section>
    </main>
  )
}

function SosPage() {
  const [notice, setNotice] = useState('')

  const notify = (text) => {
    setNotice(text)
    window.setTimeout(() => setNotice(''), 1800)
  }

  return (
    <main className="sos-page">
      <section className="sos-shell" aria-label="SOS ขอความช่วยเหลือฉุกเฉิน">
        <header className="sos-header">
          <button type="button" onClick={() => { window.location.hash = 'home' }} aria-label="กลับหน้าหลัก">‹</button>
          <div>
            <strong>SOS ฉุกเฉิน</strong>
            <small>ขอความช่วยเหลือทันทีเมื่อเกิดเหตุ</small>
          </div>
        </header>

        <section className="sos-hero">
          <div className="sos-ring"><IconPhone /></div>
          <h1>ต้องการความช่วยเหลือใช่ไหม?</h1>
          <p>กดโทรฉุกเฉิน หรือแจ้งคนในครอบครัวให้ทราบตำแหน่งและสถานะของคุณทันที</p>
          <a className="sos-main-call" href="tel:1669">โทร 1669 ฉุกเฉิน</a>
        </section>

        <section className="sos-actions" aria-label="ตัวเลือกขอความช่วยเหลือ">
          <a href="tel:191"><span>🚓</span><strong>ตำรวจ 191</strong><small>เหตุร้ายหรือความปลอดภัย</small></a>
          <a href="tel:199"><span>🚒</span><strong>ดับเพลิง 199</strong><small>ไฟไหม้หรืออุบัติเหตุรุนแรง</small></a>
          <a href="tel:022011000"><span>🏥</span><strong>โรงพยาบาล</strong><small>02-201-1000</small></a>
          <button type="button" onClick={() => notify('ส่งแจ้งเตือนให้ครอบครัวแล้ว')}><span>👨‍👩‍👧</span><strong>แจ้งครอบครัว</strong><small>ส่งข้อความขอความช่วยเหลือ</small></button>
        </section>

        <section className="sos-guide" aria-label="คำแนะนำระหว่างรอความช่วยเหลือ">
          <h2>ระหว่างรอความช่วยเหลือ</h2>
          <ul>
            <li>อยู่ในที่ปลอดภัยและมองเห็นง่าย</li>
            <li>เปิดเสียงโทรศัพท์และอย่าวางสายถ้าเจ้าหน้าที่ติดต่อกลับ</li>
            <li>เตรียมชื่อ โรคประจำตัว ยาที่ใช้ และอาการสำคัญ</li>
          </ul>
        </section>

        <p className={`toast member-toast ${notice ? 'show' : ''}`} role="status" aria-live="polite">{notice}</p>
      </section>
    </main>
  )
}

function LoginPage() {
  const loginImage = `${import.meta.env.BASE_URL}mybuddy-login.png`
  const goHome = () => { window.location.hash = 'home' }
  const goLineAuth = () => { window.location.hash = 'line-auth' }

  return (
    <main className="login-page" style={{ '--login-image': `url(${loginImage})` }}>
      <section className="login-poster" aria-label="เข้าสู่ระบบ MyBuddy+">
        <img src={loginImage} alt="หน้าเข้าสู่ระบบ MyBuddy+" />
        <button className="login-back-hotspot" type="button" onClick={() => { window.location.hash = '' }}>
          <span className="sr-only">กลับหน้าต้อนรับ</span>
        </button>
        <form className="login-form-overlay" onSubmit={(event) => { event.preventDefault(); goHome() }}>
          <label className="sr-only" htmlFor="login-user">ชื่อผู้ใช้หรืออีเมล</label>
          <input id="login-user" className="login-input login-user-input" type="text" name="username" autoComplete="username" />
          <label className="sr-only" htmlFor="login-password">รหัสผ่าน</label>
          <input id="login-password" className="login-input login-password-input" type="password" name="password" autoComplete="current-password" />
          <button className="login-submit-hotspot" type="submit"><span className="sr-only">เข้าสู่ระบบ</span></button>
          <button className="login-line-hotspot" type="button" onClick={goLineAuth}><span className="sr-only">เข้าสู่ระบบด้วย LINE</span></button>
        </form>
      </section>
    </main>
  )
}

function LineAuthPage() {
  const [isLoading, setIsLoading] = useState(false)

  const approveLogin = () => {
    setIsLoading(true)
    window.setTimeout(() => {
      window.location.hash = 'home'
    }, 850)
  }

  return (
    <main className="line-auth-page">
      <section className="line-auth-card" aria-label="ยืนยันการเข้าสู่ระบบด้วย LINE">
        <header className="line-auth-header">
          <button type="button" onClick={() => { window.location.hash = 'login' }} aria-label="กลับหน้าเข้าสู่ระบบ">‹</button>
          <strong>LINE Login</strong>
        </header>

        <div className="line-auth-brand">
          <span className="line-logo" aria-hidden="true">LINE</span>
          <span className="line-bridge" aria-hidden="true">→</span>
          <BrandIcon />
        </div>

        <h1>อนุญาตให้ MyBuddy+ เข้าสู่ระบบด้วย LINE</h1>
        <p>MyBuddy+ จะใช้ข้อมูลพื้นฐานจากบัญชี LINE เพื่อเข้าสู่ระบบและดูแลประสบการณ์ของคุณให้ต่อเนื่อง</p>

        <ul className="line-permission-list">
          <li><span>✓</span> ชื่อโปรไฟล์และรูปโปรไฟล์</li>
          <li><span>✓</span> ใช้สำหรับยืนยันตัวตนในแอป</li>
          <li><span>✓</span> ไม่โพสต์ข้อความแทนคุณ</li>
        </ul>

        <button className="line-approve-button" type="button" onClick={approveLogin} disabled={isLoading}>
          {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'อนุญาตและเข้าสู่ระบบ'}
        </button>
        <button className="line-cancel-button" type="button" onClick={() => { window.location.hash = 'login' }}>
          ยกเลิก
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
  if (route === '#line-auth') return <LineAuthPage />
  if (route === '#activities') return <ActivitiesPage />
  if (route === '#match') return <MatchPage />
  if (route === '#appointments') return <AppointmentsPage />
  if (route === '#consult') return <ConsultPage />
  if (route === '#sos') return <SosPage />
  return <LandingPage />
}

export default App
