const screens = Array.from(document.querySelectorAll('.screen'))
const splashScreen = document.querySelector('#splash')
const menuLayer = document.querySelector('.menu-layer')
const toast = document.querySelector('.toast')
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

document.querySelectorAll('[data-go]').forEach((control) => {
  control.addEventListener('click', (event) => {
    event.preventDefault()
    showScreen(control.dataset.go)
  })
})

document.querySelectorAll('[data-open-menu]').forEach((control) => {
  control.addEventListener('click', openMenu)
})

document.querySelectorAll('[data-close-menu]').forEach((control) => {
  control.addEventListener('click', closeMenu)
})

document.querySelectorAll('[data-toast]').forEach((control) => {
  control.addEventListener('click', () => showToast(control.dataset.toast))
})

document.querySelectorAll('[data-toggle-password]').forEach((control) => {
  control.addEventListener('click', () => {
    const passwordInput = document.querySelector('.family-password-input')
    if (!passwordInput) return
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password'
  })
})

menuLayer?.addEventListener('click', (event) => {
  if (event.target === menuLayer) closeMenu()
})

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu()
})

window.addEventListener('popstate', () => {
  showScreen(window.location.hash.replace('#', '') || 'login', { updateHash: false })
})

const careStorageKey = 'neomyb-carelog-demo-v1'

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function defaultCareState() {
  return {
    medicines: [
      { id: 'med-default', name: 'ยาความดัน', time: '09:00' },
    ],
    appointments: [
      { id: 'appt-default', place: 'โรงพยาบาลรามาธิบดี', date: todayIso(), time: '14:00' },
    ],
  }
}

function loadCareState() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(careStorageKey) || 'null')
    return {
      ...defaultCareState(),
      ...(saved || {}),
    }
  } catch {
    return defaultCareState()
  }
}

let careState = loadCareState()

function saveCareState() {
  try {
    window.localStorage.setItem(careStorageKey, JSON.stringify(careState))
  } catch {
    showToast('บันทึกในเครื่องไม่ได้ แต่เดโมยังใช้งานต่อได้')
  }
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

function notificationItems() {
  const medicines = careState.medicines.map((item) => ({
    id: item.id,
    sort: `${todayIso()}T${item.time || '00:00'}`,
    title: `${item.time || '--:--'} กิน${item.name || 'ยา'}`,
    detail: 'แจ้งเตือนเวลากินยาวันนี้',
  }))

  const appointments = careState.appointments.map((item) => ({
    id: item.id,
    sort: `${item.date || todayIso()}T${item.time || '00:00'}`,
    title: `${formatThaiDate(item.date)} ${item.time || '--:--'} น. ${item.place || 'นัดหมายแพทย์'}`,
    detail: 'แจ้งเตือนนัดหมายหมอ',
  }))

  return [...medicines, ...appointments].sort((a, b) => a.sort.localeCompare(b.sort))
}

function renderList(selector, items, emptyText) {
  const list = document.querySelector(selector)
  if (!list) return
  list.innerHTML = ''

  if (!items.length) {
    list.dataset.empty = emptyText
    return
  }

  items.forEach((item) => {
    const row = document.createElement('div')
    row.className = 'status-item'
    row.innerHTML = `<strong></strong><small></small>`
    row.querySelector('strong').textContent = item.title
    row.querySelector('small').textContent = item.detail
    list.append(row)
  })
}

function renderCareData() {
  const notifications = notificationItems()
  const alertDetail = document.querySelector('[data-alert-detail]')
  if (alertDetail) {
    alertDetail.textContent = notifications[0]?.title || 'ยังไม่มีรายการเตือน'
  }

  renderList('[data-notification-list]', notifications, 'ยังไม่มีรายการเตือน')
  renderList(
    '[data-medicine-list]',
    careState.medicines.map((item) => ({
      title: `${item.time || '--:--'} น. ${item.name || 'ยา'}`,
      detail: 'ระบบจะนำรายการนี้ไปขึ้นแจ้งเตือนวันนี้',
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

const medicineForm = document.querySelector('[data-medicine-form]')
medicineForm?.addEventListener('submit', (event) => {
  event.preventDefault()
  const formData = new FormData(medicineForm)
  careState.medicines.unshift({
    id: `med-${Date.now()}`,
    name: String(formData.get('name') || '').trim() || 'ยา',
    time: String(formData.get('time') || '09:00'),
  })
  saveCareState()
  renderCareData()
  showToast('บันทึกเวลาเตือนกินยาแล้ว')
  showScreen('home')
})

const appointmentForm = document.querySelector('[data-appointment-form]')
const appointmentDate = appointmentForm?.querySelector('input[name="date"]')
if (appointmentDate && !appointmentDate.value) appointmentDate.value = todayIso()

appointmentForm?.addEventListener('submit', (event) => {
  event.preventDefault()
  const formData = new FormData(appointmentForm)
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
})

renderCareData()

window.setTimeout(() => {
  showScreen(window.location.hash.replace('#', '') || 'login', { updateHash: false })
}, 2000)
