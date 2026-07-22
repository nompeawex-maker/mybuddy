const screens = Array.from(document.querySelectorAll('.screen'))
const splashScreen = document.querySelector('#splash')
const menuLayer = document.querySelector('.menu-layer')
const toast = document.querySelector('.toast')
const careStorageKey = 'neomyb-carelog-demo-v3'
let toastTimer

const text = {
  today: '\u0e27\u0e31\u0e19\u0e19\u0e35\u0e49',
  saveError: '\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01\u0e43\u0e19\u0e40\u0e04\u0e23\u0e37\u0e48\u0e2d\u0e07\u0e44\u0e21\u0e48\u0e44\u0e14\u0e49',
  medicine: '\u0e22\u0e32',
  takeMedicine: '\u0e01\u0e34\u0e19',
  medicineReminder: '\u0e40\u0e15\u0e37\u0e2d\u0e19\u0e01\u0e34\u0e19\u0e22\u0e32',
  appointment: '\u0e19\u0e31\u0e14\u0e2b\u0e21\u0e32\u0e22\u0e41\u0e1e\u0e17\u0e22\u0e4c',
  appointmentDoctor: '\u0e19\u0e31\u0e14\u0e2b\u0e21\u0e32\u0e22\u0e2b\u0e21\u0e2d',
  noNotifications: '\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e21\u0e35\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e41\u0e08\u0e49\u0e07\u0e40\u0e15\u0e37\u0e2d\u0e19',
  shownOnHome: '\u0e23\u0e32\u0e22\u0e01\u0e32\u0e23\u0e19\u0e35\u0e49\u0e08\u0e30\u0e41\u0e2a\u0e14\u0e07\u0e17\u0e35\u0e48\u0e2b\u0e19\u0e49\u0e32\u0e40\u0e21\u0e19\u0e39\u0e2b\u0e25\u0e31\u0e01',
  noMedicine: '\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e21\u0e35\u0e15\u0e32\u0e23\u0e32\u0e07\u0e01\u0e34\u0e19\u0e22\u0e32',
  noAppointment: '\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e21\u0e35\u0e19\u0e31\u0e14\u0e2b\u0e21\u0e32\u0e22\u0e2b\u0e21\u0e2d',
  medicineSaved: '\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01\u0e40\u0e27\u0e25\u0e32\u0e40\u0e15\u0e37\u0e2d\u0e19\u0e01\u0e34\u0e19\u0e22\u0e32\u0e41\u0e25\u0e49\u0e27',
  appointmentSaved: '\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01\u0e19\u0e31\u0e14\u0e2b\u0e21\u0e32\u0e22\u0e2b\u0e21\u0e2d\u0e41\u0e25\u0e49\u0e27',
  hospital: '\u0e42\u0e23\u0e07\u0e1e\u0e22\u0e32\u0e1a\u0e32\u0e25',
  timeSuffix: '\u0e19.',
}

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
  if (!dateValue) return text.today
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
    showToast(text.saveError)
  }
}

function notificationItems() {
  const medicines = careState.medicines.map((item) => ({
    id: item.id,
    type: 'medicine',
    icon: '\u{1F48A}',
    sort: `${todayIso()}T${item.time || '00:00'}`,
    title: `${item.time || '--:--'} ${text.takeMedicine}${item.name || text.medicine}`,
    detail: text.medicineReminder,
  }))

  const appointments = careState.appointments.map((item) => ({
    id: item.id,
    type: 'appointment',
    icon: '\u{1F3E5}',
    sort: `${item.date || todayIso()}T${item.time || '00:00'}`,
    title: `${item.time || '--:--'} ${item.place || text.appointment}`,
    detail: `${formatThaiDate(item.date)} ${text.appointmentDoctor}`,
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
  renderList('[data-notification-list]', notifications, text.noNotifications)
  renderList(
    '[data-medicine-list]',
    careState.medicines.map((item) => ({
      title: `${item.time || '--:--'} ${text.timeSuffix} ${item.name || text.medicine}`,
      detail: text.shownOnHome,
    })),
    text.noMedicine
  )
  renderList(
    '[data-appointment-list]',
    careState.appointments.map((item) => ({
      title: `${formatThaiDate(item.date)} ${item.time || '--:--'} ${text.timeSuffix}`,
      detail: item.place || text.appointment,
    })),
    text.noAppointment
  )
}

function submitMedicine(form) {
  const formData = new FormData(form)
  careState.medicines.unshift({
    id: `med-${Date.now()}`,
    name: String(formData.get('name') || '').trim() || text.medicine,
    time: String(formData.get('time') || '09:00'),
  })
  saveCareState()
  renderCareData()
  showToast(text.medicineSaved)
  showScreen('home')
}

function submitAppointment(form) {
  const formData = new FormData(form)
  careState.appointments.unshift({
    id: `appt-${Date.now()}`,
    place: String(formData.get('place') || '').trim() || text.hospital,
    date: String(formData.get('date') || todayIso()),
    time: String(formData.get('time') || '09:00'),
  })
  saveCareState()
  renderCareData()
  showToast(text.appointmentSaved)
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
  const initialScreen = window.location.hash.replace('#', '') || 'login'
  showScreen(initialScreen, { updateHash: false })
}, 2000)
