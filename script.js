const screens = Array.from(document.querySelectorAll('.screen'))
const splashScreen = document.querySelector('#splash')
const menuLayer = document.querySelector('.menu-layer')
const toast = document.querySelector('.toast')
const careStorageKey = 'neomyb-carelog-demo-v2'
let toastTimer

function closeMenu() {
  menuLayer?.classList.remove('open')
  menuLayer?.setAttribute('aria-hidden', 'true')
}

function openMenu() {
  menuLayer?.classList.add('open')
  menuLayer?.setAttribute('aria-hidden', 'false')
}

function showScreen(screenId, options = {}) {
  const target = document.getElementById(screenId)
  if (!target) return

  screens.forEach((screen) => {
    screen.classList.toggle('active', screen === target)
  })

  splashScreen?.classList.add('leaving')
  closeMenu()
  renderCareData()

  if (options.updateHash !== false) {
    const nextHash = screenId === 'login' ? '' : `#${screenId}`
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, '', nextHash || window.location.pathname)
    }
  }
}

function showToast(message) {
  if (!toast) return
  window.clearTimeout(toastTimer)
  toast.textContent = message
  toast.classList.add('show')
  toastTimer = window.setTimeout(() => {
    toast.classList.remove('show')
  }, 1800)
}

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function formatThaiDate(dateValue) {
  if (!dateValue) return 'วันนี้'
  const date = new Date(`${dateValue}T00:00:00`)
  return new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function loadCareState() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(careStorageKey) || 'null')
    return {
      medicines: Array.isArray(saved?.medicines) ? saved.medicines : [],
      appointments: Array.isArray(saved?.appointments) ? saved.appointments : [],
    }
  } catch {
    return { medicines: [], appointments: [] }
  }
}

let careState = loadCareState()

function saveCareState() {
  try {
    window.localStorage.setItem(careStorageKey, JSON.stringify(careState))
  } catch {
    showToast('บันทึกในเครื่องไม่ได้')
  }
}

function notificationItems() {
  const medicines = careState.medicines.map((item) => ({
    id: item.id,
    type: 'medicine',
    icon: '💊',
    sort: `${todayIso()}T${item.time || '00:00'}`,
    title: `${item.time || '--:--'} กิน${item.name || 'ยา'}`,
    detail: 'เตือนกินยา',
  }))

  const appointments = careState.appointments.map((item) => ({
    id: item.id,
    type: 'appointment',
    icon: '🏥',
    sort: `${item.date || todayIso()}T${item.time || '00:00'}`,
    title: `${item.time || '--:--'} ${item.place || 'นัดหมายแพทย์'}`,
    detail: `${formatThaiDate(item.date)} นัดหมายหมอ`,
  }))

  return [...medicines, ...appointments].sort((a, b) => a.sort.localeCompare(b.sort))
}

function renderHomeAlerts(items) {
  const list = document.querySelector('[data-home-alert-list]')
  if (!list) return
  list.innerHTML = ''

  items.slice(0, 2).forEach((item) => {
    const card = document.createElement('div')
    card.className = `home-alert-card ${item.type}`
    card.innerHTML = `
      <span class="home-alert-icon" aria-hidden="true"></span>
      <span class="home-alert-copy">
        <strong></strong>
        <small></small>
      </span>
    `
    card.querySelector('.home-alert-icon').textContent = item.icon
    card.querySelector('strong').textContent = item.title
    card.querySelector('small').textContent = item.detail
    list.append(card)
  })
}

function renderList(selector, items, emptyText) {
  const list = document.querySelector(selector)
  if (!list) return
  list.innerHTML = ''

  if (!items.length) {
    const empty = document.createElement('div')
    empty.className = 'status-item empty'
    empty.textContent = emptyText
    list.append(empty)
    return
  }

  items.forEach((item) => {
    const row = document.createElement('div')
    row.className = 'status-item'
    row.innerHTML = '<strong></strong><small></small>'
    row.querySelector('strong').textContent = item.title
    row.querySelector('small').textContent = item.detail
    list.append(row)
  })
}

function renderCareData() {
  const notifications = notificationItems()
  renderHomeAlerts(notifications)
  renderList('[data-notification-list]', notifications, 'ยังไม่มีรายการแจ้งเตือน')
  renderList(
    '[data-medicine-list]',
    careState.medicines.map((item) => ({
      title: `${item.time || '--:--'} น. ${item.name || 'ยา'}`,
      detail: 'รายการนี้จะแสดงที่หน้าเมนูหลัก',
    })),
    'ยังไม่มีตารางกินยา'
  )
  renderList(
    '[data-appointment-list]',
    careState.appointments.map((item) => ({
      title: `${formatThaiDate(item.date)} ${item.time || '--:--'} น.`,
      detail: item.place || 'นัดหมายแพทย์',
    })),
    'ยังไม่มีนัดหมายหมอ'
  )
}

function submitMedicine(form) {
  const formData = new FormData(form)
  careState.medicines.unshift({
    id: `med-${Date.now()}`,
    name: String(formData.get('name') || '').trim() || 'ยา',
    time: String(formData.get('time') || '09:00'),
  })
  saveCareState()
  renderCareData()
  showToast('บันทึกเวลาเตือนกินยาแล้ว')
  showScreen('home')
}

function submitAppointment(form) {
  const formData = new FormData(form)
  careState.appointments.unshift({
    id: `appt-${Date.now()}`,
    place: String(formData.get('place') || '').trim() || 'โรงพยาบาล',
    date: String(formData.get('date') || todayIso()),
    time: String(formData.get('time') || '09:00'),
  })
  saveCareState()
  renderCareData()
  showToast('บันทึกนัดหมายหมอแล้ว')
  showScreen('home')
}

document.addEventListener('click', (event) => {
  const menuButton = event.target.closest('[data-open-menu]')
  if (menuButton) {
    event.preventDefault()
    openMenu()
    return
  }

  if (event.target === menuLayer || event.target.closest('[data-close-menu]')) {
    event.preventDefault()
    closeMenu()
    return
  }

  const toastButton = event.target.closest('[data-toast]')
  if (toastButton) {
    event.preventDefault()
    showToast(toastButton.dataset.toast)
    return
  }

  const passwordButton = event.target.closest('[data-toggle-password]')
  if (passwordButton) {
    event.preventDefault()
    const input = document.querySelector('.family-password-input')
    if (input) input.type = input.type === 'password' ? 'text' : 'password'
    return
  }

  const nav = event.target.closest('[data-go]')
  if (nav) {
    event.preventDefault()
    showScreen(nav.dataset.go || 'home')
  }
})

document.addEventListener('submit', (event) => {
  const medicineForm = event.target.closest('[data-medicine-form]')
  const appointmentForm = event.target.closest('[data-appointment-form]')
  if (!medicineForm && !appointmentForm) return

  event.preventDefault()
  if (medicineForm) submitMedicine(medicineForm)
  if (appointmentForm) submitAppointment(appointmentForm)
})

window.addEventListener('popstate', () => {
  showScreen(window.location.hash.replace('#', '') || 'login', { updateHash: false })
})

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu()
})

const appointmentDate = document.querySelector('[data-appointment-form] input[name="date"]')
if (appointmentDate && !appointmentDate.value) appointmentDate.value = todayIso()

renderCareData()

window.setTimeout(() => {
  showScreen(window.location.hash.replace('#', '') || 'login', { updateHash: false })
}, 2000)
