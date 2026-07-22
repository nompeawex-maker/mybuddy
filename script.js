var screens = Array.prototype.slice.call(document.querySelectorAll('.screen'))
var splashScreen = document.getElementById('splash')
var menuLayer = document.querySelector('.menu-layer')
var toast = document.querySelector('.toast')
var careStorageKey = 'neomyb-carelog-demo-v4'
var toastTimer = null

var text = {
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
  timeSuffix: '\u0e19.'
}

function closestElement(element, selector) {
  while (element && element !== document) {
    if (element.matches && element.matches(selector)) return element
    element = element.parentNode
  }
  return null
}

function closeMenu() {
  if (!menuLayer) return
  menuLayer.classList.remove('open')
  menuLayer.setAttribute('aria-hidden', 'true')
}

function openMenu() {
  if (!menuLayer) return
  menuLayer.classList.add('open')
  menuLayer.setAttribute('aria-hidden', 'false')
}

function showScreen(screenId, options) {
  var target = document.getElementById(screenId)
  if (!target) return false

  for (var i = 0; i < screens.length; i += 1) {
    if (screens[i] === target) screens[i].classList.add('active')
    else screens[i].classList.remove('active')
  }

  if (splashScreen) splashScreen.classList.add('leaving')
  closeMenu()
  renderCareData()

  options = options || {}
  if (options.updateHash !== false) {
    var nextHash = screenId === 'login' ? '' : '#' + screenId
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, '', nextHash || window.location.pathname)
    }
  }
  return false
}

function showToast(message) {
  if (!toast) return
  window.clearTimeout(toastTimer)
  toast.textContent = message
  toast.classList.add('show')
  toastTimer = window.setTimeout(function () {
    toast.classList.remove('show')
  }, 1800)
}

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function formatThaiDate(dateValue) {
  if (!dateValue) return text.today
  var date = new Date(dateValue + 'T00:00:00')
  return new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

function loadCareState() {
  try {
    var raw = window.localStorage.getItem(careStorageKey)
    var saved = raw ? JSON.parse(raw) : {}
    return {
      medicines: saved && Array.isArray(saved.medicines) ? saved.medicines : [],
      appointments: saved && Array.isArray(saved.appointments) ? saved.appointments : []
    }
  } catch (error) {
    return { medicines: [], appointments: [] }
  }
}

var careState = loadCareState()

function saveCareState() {
  try {
    window.localStorage.setItem(careStorageKey, JSON.stringify(careState))
  } catch (error) {
    showToast(text.saveError)
  }
}

function notificationItems() {
  var items = []
  var i

  for (i = 0; i < careState.medicines.length; i += 1) {
    var medicine = careState.medicines[i]
    items.push({
      id: medicine.id,
      type: 'medicine',
      icon: '\uD83D\uDC8A',
      sort: todayIso() + 'T' + (medicine.time || '00:00'),
      title: (medicine.time || '--:--') + ' ' + text.takeMedicine + (medicine.name || text.medicine),
      detail: text.medicineReminder
    })
  }

  for (i = 0; i < careState.appointments.length; i += 1) {
    var appointment = careState.appointments[i]
    items.push({
      id: appointment.id,
      type: 'appointment',
      icon: '\uD83C\uDFE5',
      sort: (appointment.date || todayIso()) + 'T' + (appointment.time || '00:00'),
      title: (appointment.time || '--:--') + ' ' + (appointment.place || text.appointment),
      detail: formatThaiDate(appointment.date) + ' ' + text.appointmentDoctor
    })
  }

  items.sort(function (a, b) {
    return a.sort.localeCompare(b.sort)
  })
  return items
}

function renderHomeAlerts(items) {
  var list = document.querySelector('[data-home-alert-list]')
  if (!list) return
  list.innerHTML = ''

  for (var i = 0; i < items.length && i < 2; i += 1) {
    var item = items[i]
    var card = document.createElement('div')
    card.className = 'home-alert-card ' + item.type
    card.innerHTML = '<span class="home-alert-icon" aria-hidden="true"></span><span class="home-alert-copy"><strong></strong><small></small></span>'
    card.querySelector('.home-alert-icon').textContent = item.icon
    card.querySelector('strong').textContent = item.title
    card.querySelector('small').textContent = item.detail
    list.appendChild(card)
  }
}

function renderList(selector, items, emptyText) {
  var list = document.querySelector(selector)
  if (!list) return
  list.innerHTML = ''

  if (!items.length) {
    var empty = document.createElement('div')
    empty.className = 'status-item empty'
    empty.textContent = emptyText
    list.appendChild(empty)
    return
  }

  for (var i = 0; i < items.length; i += 1) {
    var item = items[i]
    var row = document.createElement('div')
    row.className = 'status-item'
    row.innerHTML = '<strong></strong><small></small>'
    row.querySelector('strong').textContent = item.title
    row.querySelector('small').textContent = item.detail
    list.appendChild(row)
  }
}

function renderCareData() {
  var notifications = notificationItems()
  renderHomeAlerts(notifications)
  renderList('[data-notification-list]', notifications, text.noNotifications)

  var medicines = []
  for (var i = 0; i < careState.medicines.length; i += 1) {
    medicines.push({
      title: (careState.medicines[i].time || '--:--') + ' ' + text.timeSuffix + ' ' + (careState.medicines[i].name || text.medicine),
      detail: text.shownOnHome
    })
  }
  renderList('[data-medicine-list]', medicines, text.noMedicine)

  var appointments = []
  for (var j = 0; j < careState.appointments.length; j += 1) {
    appointments.push({
      title: formatThaiDate(careState.appointments[j].date) + ' ' + (careState.appointments[j].time || '--:--') + ' ' + text.timeSuffix,
      detail: careState.appointments[j].place || text.appointment
    })
  }
  renderList('[data-appointment-list]', appointments, text.noAppointment)
}

function submitMedicine(form) {
  if (!form) return false
  var formData = new FormData(form)
  careState.medicines.unshift({
    id: 'med-' + Date.now(),
    name: String(formData.get('name') || '').trim() || text.medicine,
    time: String(formData.get('time') || '09:00')
  })
  saveCareState()
  renderCareData()
  showToast(text.medicineSaved)
  return showScreen('home')
}

function submitAppointment(form) {
  if (!form) return false
  var formData = new FormData(form)
  careState.appointments.unshift({
    id: 'appt-' + Date.now(),
    place: String(formData.get('place') || '').trim() || text.hospital,
    date: String(formData.get('date') || todayIso()),
    time: String(formData.get('time') || '09:00')
  })
  saveCareState()
  renderCareData()
  showToast(text.appointmentSaved)
  return showScreen('home')
}

function submitMedicineForm(form) {
  return submitMedicine(form)
}

function submitAppointmentForm(form) {
  return submitAppointment(form)
}

window.showScreen = showScreen
window.submitMedicine = submitMedicine
window.submitAppointment = submitAppointment
window.submitMedicineForm = submitMedicineForm
window.submitAppointmentForm = submitAppointmentForm

document.addEventListener('click', function (event) {
  var menuButton = closestElement(event.target, '[data-open-menu]')
  if (menuButton) {
    event.preventDefault()
    openMenu()
    return
  }

  if (event.target === menuLayer || closestElement(event.target, '[data-close-menu]')) {
    event.preventDefault()
    closeMenu()
    return
  }

  var toastButton = closestElement(event.target, '[data-toast]')
  if (toastButton) {
    event.preventDefault()
    showToast(toastButton.getAttribute('data-toast'))
    return
  }

  var passwordButton = closestElement(event.target, '[data-toggle-password]')
  if (passwordButton) {
    event.preventDefault()
    var input = document.querySelector('.family-password-input')
    if (input) input.type = input.type === 'password' ? 'text' : 'password'
    return
  }

  var nav = closestElement(event.target, '[data-go]')
  if (nav) {
    event.preventDefault()
    showScreen(nav.getAttribute('data-go') || 'home')
  }
})

document.addEventListener('submit', function (event) {
  var medicineForm = closestElement(event.target, '[data-medicine-form]')
  var appointmentForm = closestElement(event.target, '[data-appointment-form]')
  if (!medicineForm && !appointmentForm) return

  event.preventDefault()
  if (medicineForm) submitMedicine(medicineForm)
  if (appointmentForm) submitAppointment(appointmentForm)
})

window.addEventListener('popstate', function () {
  showScreen(window.location.hash.replace('#', '') || 'login', { updateHash: false })
})

window.addEventListener('hashchange', function () {
  showScreen(window.location.hash.replace('#', '') || 'login', { updateHash: false })
})

window.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') closeMenu()
})

var appointmentDate = document.querySelector('[data-appointment-form] input[name="date"]')
if (appointmentDate && !appointmentDate.value) appointmentDate.value = todayIso()

renderCareData()

window.setTimeout(function () {
  var initialScreen = window.location.hash.replace('#', '') || 'login'
  showScreen(initialScreen, { updateHash: false })
}, 2000)
