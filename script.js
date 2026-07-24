var screens = Array.prototype.slice.call(document.querySelectorAll('.screen'))
var splashScreen = document.getElementById('splash')
var menuLayer = document.querySelector('.menu-layer')
var toast = document.querySelector('.toast')
var careStorageKey = 'neomyb-carelog-demo-v4'
var buddyStorageKey = 'neomyb-buddy-demo-v1'
var toastTimer = null
var lastTouchNavTime = 0
var buddySwipeLock = false
var buddyDrag = null

var screenAliases = {
  matches: 'buddy-match',
  match: 'buddy-match',
  'buddy-matches': 'buddy-match',
  'buddy-match-list': 'buddy-match',
  'buddy-all-matches': 'buddy-match'
}

function normalizeScreenId(screenId) {
  return screenAliases[screenId] || screenId
}

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
  screenId = normalizeScreenId(screenId)
  var target = document.getElementById(screenId)
  if (!target) return false

  for (var i = 0; i < screens.length; i += 1) {
    if (screens[i] === target) screens[i].classList.add('active')
    else screens[i].classList.remove('active')
  }

  if (splashScreen) splashScreen.classList.add('leaving')
  closeMenu()
  renderCareData()
  renderBuddyData()

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
var buddyIndex = 0

var buddyProfiles = [
  {
    name: 'คุณกานิน, 64',
    distance: '0.8 กม.',
    area: 'อยู่ใกล้สวนลุมพินี ประมาณ 0.8 กม.',
    summary: 'อยู่ใกล้สวนสาธารณะ ชอบเดินตอนเช้าและคุยเรื่องสุขภาพ',
    tags: ['เดินเล่น', 'สุขภาพ', 'กาแฟเช้า'],
    time: 'ช่วงเช้า',
    goal: 'เพื่อนคุยและเพื่อนเดินเล่น',
    note: 'เดินได้ปกติ แต่ไม่ต้องการกิจกรรมที่หนักมาก'
  },
  {
    name: 'คุณมาลี, 62',
    distance: '1.4 กม.',
    area: 'อยู่ใกล้ศูนย์ชุมชน ประมาณ 1.4 กม.',
    summary: 'ชอบทำอาหารสุขภาพ ฟังเพลง และเข้ากิจกรรมกลุ่ม',
    tags: ['ทำอาหาร', 'ฟังเพลง', 'กิจกรรมกลุ่ม'],
    time: 'ช่วงบ่าย',
    goal: 'เพื่อนคุยและเพื่อนทำกิจกรรม',
    note: 'ชอบสถานที่เดินทางสะดวกและคนไม่แน่นมาก'
  },
  {
    name: 'คุณอนงค์, 67',
    distance: '2.1 กม.',
    area: 'อยู่แถวตลาดเช้า ประมาณ 2.1 กม.',
    summary: 'ชอบอ่านหนังสือ เดินเล่นเบา ๆ และแลกเปลี่ยนเรื่องดูแลสุขภาพ',
    tags: ['อ่านหนังสือ', 'เดินเบา ๆ', 'ดูแลสุขภาพ'],
    time: 'ช่วงเย็น',
    goal: 'เพื่อนคุยประจำและเพื่อนร่วมกิจกรรมเบา ๆ',
    note: 'เดินระยะสั้นได้ดี ต้องการกิจกรรมที่มีที่นั่งพัก'
  }
]

function loadBuddyState() {
  try {
    var raw = window.localStorage.getItem(buddyStorageKey)
    var saved = raw ? JSON.parse(raw) : {}
    return {
      matches: saved && Array.isArray(saved.matches) ? saved.matches : [],
      messages: saved && Array.isArray(saved.messages) ? saved.messages : [
        { type: 'incoming', text: 'สวัสดีครับ วันนี้สะดวกคุยไหมครับ' },
        { type: 'outgoing', text: 'สะดวกครับ อยากไปเดินเล่นช่วงเช้า' }
      ],
      activities: saved && Array.isArray(saved.activities) ? saved.activities : [],
      rides: saved && Array.isArray(saved.rides) ? saved.rides : []
    }
  } catch (error) {
    return { matches: [], messages: [], activities: [], rides: [] }
  }
}

var buddyState = loadBuddyState()

function saveBuddyState() {
  try {
    window.localStorage.setItem(buddyStorageKey, JSON.stringify(buddyState))
  } catch (error) {
    showToast(text.saveError)
  }
}

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
      detail: formatThaiDate(appointment.date) + ' ' + (appointment.department || text.appointmentDoctor)
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

function renderNextAppointment() {
  var title = document.querySelector('[data-next-appointment-title]')
  var detail = document.querySelector('[data-next-appointment-detail]')
  var month = document.querySelector('[data-next-appointment-month]')
  var day = document.querySelector('[data-next-appointment-day]')
  if (!title || !detail || !month || !day) return

  if (!careState.appointments.length) {
    title.textContent = 'ยังไม่มีนัดหมาย'
    detail.textContent = 'เพิ่มนัดหมายใหม่เพื่อให้ระบบสรุปข้อมูลสำคัญไว้ตรงนี้'
    month.textContent = '--'
    day.textContent = '--'
    return
  }

  var next = careState.appointments.slice().sort(function (a, b) {
    var aSort = (a.date || todayIso()) + 'T' + (a.time || '00:00')
    var bSort = (b.date || todayIso()) + 'T' + (b.time || '00:00')
    return aSort.localeCompare(bSort)
  })[0]
  var date = next.date ? new Date(next.date + 'T00:00:00') : null
  title.textContent = next.place || text.hospital
  detail.textContent = [
    next.department || text.appointmentDoctor,
    next.time ? next.time + ' น.' : '',
    next.channel || '',
    next.note || ''
  ].filter(Boolean).join(' • ')
  month.textContent = date ? date.toLocaleDateString('th-TH', { month: 'short' }) : '--'
  day.textContent = date ? String(date.getDate()) : '--'
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
      detail: [
        careState.appointments[j].place || text.appointment,
        careState.appointments[j].department || '',
        careState.appointments[j].channel || ''
      ].filter(Boolean).join(' • ')
    })
  }
  renderList('[data-appointment-list]', appointments, text.noAppointment)
  renderNextAppointment()
}

function setText(selector, value) {
  var element = document.querySelector(selector)
  if (element) element.textContent = value
}

function renderBuddyData() {
  var profile = buddyProfiles[buddyIndex % buddyProfiles.length]
  setText('[data-buddy-name]', profile.name)
  setText('[data-buddy-distance]', profile.distance)
  setText('[data-buddy-summary]', profile.summary)
  setText('[data-profile-name]', profile.name)
  setText('[data-profile-area]', profile.area)
  setText('[data-profile-tags]', profile.tags.join(' / '))
  setText('[data-profile-time]', profile.time)
  setText('[data-profile-goal]', profile.goal)
  setText('[data-profile-note]', profile.note)

  var tagContainer = document.querySelector('[data-buddy-tags]')
  if (tagContainer) {
    tagContainer.innerHTML = ''
    for (var i = 0; i < profile.tags.length; i += 1) {
      var chip = document.createElement('span')
      chip.textContent = profile.tags[i]
      tagContainer.appendChild(chip)
    }
  }
  renderBuddyState()
}

function profileKey(profile) {
  return String(profile.name || '').split(',')[0]
}

function ensureBuddyMatch(profile) {
  var key = profileKey(profile)
  for (var i = 0; i < buddyState.matches.length; i += 1) {
    if (buddyState.matches[i].name === key) return
  }
  buddyState.matches.unshift({
    name: key,
    distance: profile.distance,
    summary: profile.summary,
    status: 'พร้อมคุย'
  })
  saveBuddyState()
}

function renderBuddyState() {
  setText('[data-buddy-match-count]', String(buddyState.matches.length))
  setText('[data-buddy-activity-count]', String(buddyState.activities.length))
  setText('[data-buddy-ride-count]', String(buddyState.rides.length))

  var matchList = document.querySelector('[data-buddy-match-list]')
  if (matchList) {
    matchList.innerHTML = ''
    var matches = buddyState.matches.length ? buddyState.matches : [
      { name: 'คุณกานิน', distance: '0.8 กม.', summary: 'พร้อมคุยตอนเช้า', status: 'ตัวอย่าง' }
    ]
    for (var i = 0; i < matches.length; i += 1) {
      var match = matches[i]
      var row = document.createElement('button')
      row.type = 'button'
      row.setAttribute('data-go', 'buddy-chat')
      row.innerHTML = '<span class="buddy-avatar"></span><strong></strong><small></small>'
      row.querySelector('.buddy-avatar').textContent = match.name.replace('คุณ', '').slice(0, 1) || 'B'
      row.querySelector('strong').textContent = match.name
      row.querySelector('small').textContent = match.status + ' / ' + match.distance + ' / ' + match.summary
      matchList.appendChild(row)
    }
  }

  var chatList = document.querySelector('[data-buddy-chat-list]')
  if (chatList) {
    chatList.innerHTML = ''
    for (var j = 0; j < buddyState.messages.length; j += 1) {
      var bubble = document.createElement('span')
      bubble.className = buddyState.messages[j].type || 'outgoing'
      bubble.textContent = buddyState.messages[j].text
      chatList.appendChild(bubble)
    }
  }

  var activityList = document.querySelector('[data-buddy-activity-list]')
  if (activityList) {
    activityList.innerHTML = ''
    if (!buddyState.activities.length) {
      var emptyActivity = document.createElement('div')
      emptyActivity.className = 'status-item empty'
      emptyActivity.textContent = 'ยังไม่มีกิจกรรมที่บันทึก'
      activityList.appendChild(emptyActivity)
    }
    for (var k = 0; k < buddyState.activities.length; k += 1) {
      var activity = buddyState.activities[k]
      var activityRow = document.createElement('div')
      activityRow.className = 'status-item'
      activityRow.innerHTML = '<strong></strong><small></small>'
      activityRow.querySelector('strong').textContent = activity.title + ' / ' + activity.time
      activityRow.querySelector('small').textContent = activity.place + ' / ' + activity.note
      activityList.appendChild(activityRow)
    }
  }

  var latestActivity = buddyState.activities[0]
  setText('[data-buddy-group-latest]', latestActivity ? latestActivity.title + ' เวลา ' + latestActivity.time : 'ยังไม่มีกิจกรรมที่บันทึก')
  setText('[data-buddy-group-members]', buddyState.matches.length ? buddyState.matches.map(function (item) { return item.name }).join(' / ') + ' / คุณผู้ชาย' : 'คุณกานิน / คุณผู้ชาย')

  var rideLists = document.querySelectorAll('[data-buddy-ride-list]')
  for (var rideListIndex = 0; rideListIndex < rideLists.length; rideListIndex += 1) {
    var rideList = rideLists[rideListIndex]
    rideList.innerHTML = ''
    if (!buddyState.rides.length) {
      var emptyRide = document.createElement('span')
      emptyRide.innerHTML = '<strong>ยังไม่มีคำขอรถ</strong><small>กรอกข้อมูลแล้วกดบันทึกคำขอรถ</small>'
      rideList.appendChild(emptyRide)
    }
    for (var r = 0; r < buddyState.rides.length; r += 1) {
      var ride = buddyState.rides[r]
      var rideRow = document.createElement('span')
      rideRow.innerHTML = '<strong></strong><small></small>'
      rideRow.querySelector('strong').textContent = ride.type + ' / ' + ride.time
      rideRow.querySelector('small').textContent = ride.pickup + ' ไป ' + ride.destination + ' / ' + ride.note
      rideList.appendChild(rideRow)
    }
  }

  var trackingList = document.querySelector('[data-buddy-tracking-list]')
  if (trackingList) {
    trackingList.innerHTML = ''
    var steps = []
    if (buddyState.rides[0]) {
      steps.push({ title: buddyState.rides[0].time, detail: 'รถออกจาก ' + buddyState.rides[0].pickup })
      steps.push({ title: 'ระหว่างทาง', detail: 'ระบบคำนวณเส้นทางรับ Buddy ตามลำดับ' })
      steps.push({ title: 'จุดหมาย', detail: 'เดินทางไป ' + buddyState.rides[0].destination })
    } else if (buddyState.activities[0]) {
      steps.push({ title: buddyState.activities[0].time, detail: 'นัดกิจกรรมที่ ' + buddyState.activities[0].place })
      steps.push({ title: 'ครอบครัว', detail: 'พร้อมแจ้งสถานะเมื่อเริ่มเดินทาง' })
    } else {
      steps.push({ title: 'พร้อมใช้งาน', detail: 'เมื่อบันทึกกิจกรรมหรือเรียกรถ ระบบจะแสดงสถานะที่นี่' })
    }
    for (var s = 0; s < steps.length; s += 1) {
      var step = document.createElement('span')
      step.innerHTML = '<strong></strong><small></small>'
      step.querySelector('strong').textContent = steps[s].title
      step.querySelector('small').textContent = steps[s].detail
      trackingList.appendChild(step)
    }
  }
}

function nextBuddyProfile() {
  buddyIndex = (buddyIndex + 1) % buddyProfiles.length
  renderBuddyData()
  showToast('เปลี่ยน Buddy แนะนำแล้ว')
}

function likeBuddyProfile() {
  renderBuddyData()
  showToast('จับคู่ Buddy สำเร็จแล้ว')
  return showScreen('buddy-match')
}

function appendBuddyMessage(message) {
  var list = document.querySelector('[data-buddy-chat-list]')
  if (!list || !message) return
  var bubble = document.createElement('span')
  bubble.className = 'outgoing'
  bubble.textContent = message
  list.appendChild(bubble)
  list.scrollTop = list.scrollHeight
}

function likeBuddyProfile() {
  ensureBuddyMatch(buddyProfiles[buddyIndex % buddyProfiles.length])
  renderBuddyState()
  showToast('จับคู่ Buddy สำเร็จแล้ว')
  return showScreen('buddy-match')
}

function appendBuddyMessage(message) {
  var list = document.querySelector('[data-buddy-chat-list]')
  if (!list || !message) return
  var bubble = document.createElement('span')
  bubble.className = 'outgoing'
  bubble.textContent = message
  list.appendChild(bubble)
  buddyState.messages.push({ type: 'outgoing', text: message })
  saveBuddyState()
  list.scrollTop = list.scrollHeight
}

function discoveryCard() {
  return document.querySelector('#buddy-discovery.active .buddy-discovery-card')
}

function animateBuddyCard(direction, done) {
  var card = discoveryCard()
  if (!card || buddySwipeLock) {
    if (typeof done === 'function') done()
    return
  }

  buddySwipeLock = true
  card.classList.remove('swipe-in', 'swipe-left', 'swipe-right', 'is-dragging')
  card.style.transform = ''
  card.classList.add(direction === 'right' ? 'swipe-right' : 'swipe-left')

  window.setTimeout(function () {
    if (typeof done === 'function') done()
    card.classList.remove('swipe-left', 'swipe-right')
    card.classList.add('swipe-in')
    window.setTimeout(function () {
      card.classList.remove('swipe-in')
      buddySwipeLock = false
    }, 340)
  }, 280)
}

function nextBuddyAnimated() {
  animateBuddyCard('left', function () {
    nextBuddyProfile()
  })
}

function likeBuddyAnimated() {
  animateBuddyCard('right', function () {
    likeBuddyProfile()
  })
}

function beginBuddyDrag(event) {
  var card = discoveryCard()
  if (!card || buddySwipeLock || !event.touches || !event.touches[0]) return
  if (closestElement(event.target, 'button, a, input, select, textarea')) return
  buddyDrag = {
    card: card,
    startX: event.touches[0].clientX,
    startY: event.touches[0].clientY,
    dx: 0,
    dy: 0
  }
  card.classList.add('is-dragging')
}

function moveBuddyDrag(event) {
  if (!buddyDrag || !event.touches || !event.touches[0]) return
  buddyDrag.dx = event.touches[0].clientX - buddyDrag.startX
  buddyDrag.dy = event.touches[0].clientY - buddyDrag.startY

  if (Math.abs(buddyDrag.dy) > Math.abs(buddyDrag.dx) * 1.25) return
  event.preventDefault()

  var rotate = Math.max(-10, Math.min(10, buddyDrag.dx / 18))
  var scale = 1 - Math.min(Math.abs(buddyDrag.dx) / 900, .04)
  buddyDrag.card.style.transform = 'translate3d(' + buddyDrag.dx + 'px, 0, 0) rotate(' + rotate + 'deg) scale(' + scale + ')'
}

function finishBuddyDrag(event) {
  if (!buddyDrag) return false
  var dx = buddyDrag.dx
  var dy = buddyDrag.dy
  var card = buddyDrag.card
  buddyDrag = null
  card.classList.remove('is-dragging')

  if (Math.abs(dx) < 70 || Math.abs(dy) > Math.abs(dx) * 1.35) {
    card.style.transform = ''
    return false
  }

  event.preventDefault()
  card.style.transform = ''
  if (dx > 0) likeBuddyAnimated()
  else nextBuddyAnimated()
  lastTouchNavTime = Date.now()
  return true
}

function handleBuddyAction(event) {
  var nextButton = closestElement(event.target, '[data-next-buddy]')
  if (nextButton) {
    event.preventDefault()
    if (discoveryCard()) nextBuddyAnimated()
    else nextBuddyProfile()
    if (nextButton.getAttribute('data-go')) showScreen(nextButton.getAttribute('data-go'))
    return true
  }

  if (closestElement(event.target, '[data-like-buddy]')) {
    event.preventDefault()
    if (discoveryCard()) likeBuddyAnimated()
    else likeBuddyProfile()
    return true
  }

  var quickMessage = closestElement(event.target, '[data-buddy-message]')
  if (quickMessage) {
    event.preventDefault()
    appendBuddyMessage(quickMessage.getAttribute('data-buddy-message'))
    return true
  }

  if (closestElement(event.target, '[data-send-buddy-message]')) {
    event.preventDefault()
    var input = document.querySelector('[data-buddy-chat-input]')
    var message = input ? String(input.value || '').trim() : ''
    appendBuddyMessage(message || 'สวัสดีครับ')
    if (input) input.value = ''
    return true
  }

  return false
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
    department: String(formData.get('department') || '').trim() || text.appointmentDoctor,
    date: String(formData.get('date') || todayIso()),
    time: String(formData.get('time') || '09:00'),
    channel: String(formData.get('channel') || '').trim(),
    note: String(formData.get('note') || '').trim()
  })
  saveCareState()
  renderCareData()
  showToast(text.appointmentSaved)
  return showScreen('home')
}

function submitBuddyActivity(form) {
  var formData = new FormData(form)
  buddyState.activities.unshift({
    id: 'act-' + Date.now(),
    title: String(formData.get('title') || '').trim() || 'กิจกรรม Buddy',
    date: String(formData.get('date') || todayIso()),
    time: String(formData.get('time') || '08:00'),
    place: String(formData.get('place') || '').trim() || 'สถานที่นัดหมาย',
    note: String(formData.get('note') || '').trim() || 'กิจกรรมเบา ๆ'
  })
  saveBuddyState()
  renderBuddyState()
  showToast('บันทึกกิจกรรม Buddy แล้ว')
  return showScreen('buddy-group')
}

function submitBuddyRide(form) {
  var formData = new FormData(form)
  buddyState.rides.unshift({
    id: 'ride-' + Date.now(),
    type: String(formData.get('type') || 'รถกลุ่ม'),
    pickup: String(formData.get('pickup') || '').trim() || 'บ้านของคุณผู้ชาย',
    destination: String(formData.get('destination') || '').trim() || 'จุดหมาย',
    time: String(formData.get('time') || '07:30'),
    note: String(formData.get('note') || '').trim() || 'เดินทางแบบสะดวก'
  })
  saveBuddyState()
  renderBuddyState()
  showToast('บันทึกคำขอรถแล้ว')
  return showScreen('buddy-tracking')
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

function handleLoginFallback(event) {
  var login = closestElement(event.target, '.login-screen')
  if (!login || !login.classList.contains('active')) return false
  if (closestElement(event.target, '[data-go], [data-open-menu]')) return false

  var rect = login.getBoundingClientRect()
  var point = event.changedTouches && event.changedTouches[0] ? event.changedTouches[0] : event
  var x = (point.clientX - rect.left) / rect.width
  var y = (point.clientY - rect.top) / rect.height

  if (x > 0.82 && y < 0.12) {
    event.preventDefault()
    openMenu()
    return true
  }

  if (x > 0.10 && x < 0.90 && y > 0.69 && y < 0.79) {
    event.preventDefault()
    showScreen('line-login')
    return true
  }

  if (x > 0.10 && x < 0.90 && y > 0.79 && y < 0.90) {
    event.preventDefault()
    showScreen('family-login')
    return true
  }

  return false
}

function activateNavigationFromEvent(event) {
  var nav = closestElement(event.target, '[data-go]')
  if (!nav) return false

  event.preventDefault()
  var nextScreen = normalizeScreenId(nav.getAttribute('data-go') || 'home')
  window.location.hash = nextScreen === 'login' ? '' : nextScreen
  showScreen(nextScreen)
  return true
}

document.addEventListener('touchend', function (event) {
  if (finishBuddyDrag(event)) return
  if (handleBuddyAction(event)) {
    lastTouchNavTime = Date.now()
    return
  }
  if (activateNavigationFromEvent(event)) {
    lastTouchNavTime = Date.now()
    return
  }
  handleLoginFallback(event)
}, { passive: false })

document.addEventListener('touchstart', function (event) {
  beginBuddyDrag(event)
}, { passive: true })

document.addEventListener('touchmove', function (event) {
  moveBuddyDrag(event)
}, { passive: false })

document.addEventListener('click', function (event) {
  if (Date.now() - lastTouchNavTime < 450 && closestElement(event.target, '[data-go], [data-next-buddy], [data-like-buddy], [data-buddy-next], [data-buddy-like], [data-buddy-save], [data-buddy-message-open], [data-buddy-message], [data-send-buddy-message]')) {
    event.preventDefault()
    return
  }

  if (handleLoginFallback(event)) return
  if (handleBuddyAction(event)) return

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

  activateNavigationFromEvent(event)
})

document.addEventListener('submit', function (event) {
  var medicineForm = closestElement(event.target, '[data-medicine-form]')
  var appointmentForm = closestElement(event.target, '[data-appointment-form]')
  var buddyActivityForm = closestElement(event.target, '[data-buddy-activity-form]')
  var buddyRideForm = closestElement(event.target, '[data-buddy-ride-form]')
  if (!medicineForm && !appointmentForm && !buddyActivityForm && !buddyRideForm) return

  event.preventDefault()
  if (medicineForm) submitMedicine(medicineForm)
  if (appointmentForm) submitAppointment(appointmentForm)
  if (buddyActivityForm) submitBuddyActivity(buddyActivityForm)
  if (buddyRideForm) submitBuddyRide(buddyRideForm)
})

document.addEventListener('click', function (event) {
  if (!closestElement(event.target, '[data-focus-appointment-form]')) return
  var panel = document.getElementById('appointment-form-panel')
  if (panel && typeof panel.scrollIntoView === 'function') {
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
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
renderBuddyData()

window.setTimeout(function () {
  var initialScreen = window.location.hash.replace('#', '') || 'login'
  showScreen(initialScreen, { updateHash: false })
}, 2000)

var cleanBuddyIndex = 0
var cleanBuddyDrag = null
var cleanBuddyLock = false
var cleanBuddyProfiles = [
  {
    name: 'คุณสมชาย',
    age: '70',
    image: 'assets/buddy-somchai.jpg?v=111',
    distance: 'ใกล้คุณ 1.8 กม.',
    summary: 'ชอบเดินเล่น เล่นหมากรุก คุยเรื่องข่าว และออกกำลังกายเบา ๆ'
  },
  {
    name: 'คุณมาลี',
    age: '66',
    image: 'assets/buddy-malee.jpg?v=111',
    distance: 'ใกล้คุณ 3.2 กม.',
    summary: 'ชอบทำอาหาร ปลูกต้นไม้ ทำบุญ และเข้ากิจกรรมกลุ่ม'
  },
  {
    name: 'คุณอรุณี',
    age: '68',
    image: 'assets/buddy-malee.jpg?v=111',
    distance: 'เพิ่งเข้าร่วมไม่นานนี้',
    summary: 'ชอบเดินเล่น ทำบุญ ฟังเพลง และคุยตอนเช้า'
  }
]

cleanBuddyProfiles = cleanBuddyProfiles.filter(function (profile) {
  return profile.age !== '68'
})

function getCleanBuddyProfile() {
  return cleanBuddyProfiles[cleanBuddyIndex % cleanBuddyProfiles.length]
}

function renderBuddyData() {
  var profile = getCleanBuddyProfile()
  var image = document.querySelector('[data-buddy-card-image]')
  if (image && image.getAttribute('src') !== profile.image) {
    image.setAttribute('src', profile.image)
    image.setAttribute('alt', 'หน้า Buddy ของ ' + profile.name)
  }

  setText('[data-buddy-name]', profile.name + ', ' + profile.age)
  setText('[data-buddy-distance]', profile.distance)
  setText('[data-buddy-summary]', profile.summary)
  setText('[data-profile-name]', profile.name + ', ' + profile.age)
  setText('[data-profile-area]', profile.distance)
  var profileImage = document.querySelector('[data-profile-photo]')
  if (profileImage) profileImage.setAttribute('src', profile.image)

  if (typeof renderBuddyState === 'function') {
    renderBuddyState()
  }
}

function animateCleanBuddy(direction, callback) {
  var image = document.querySelector('#buddy-discovery.active [data-buddy-card-image]')
  if (!image || cleanBuddyLock) {
    if (callback) callback()
    return true
  }

  cleanBuddyLock = true
  image.classList.remove('swipe-in', 'swipe-left', 'swipe-right')
  image.classList.add(direction === 'left' ? 'swipe-left' : 'swipe-right')
  window.setTimeout(function () {
    if (callback) callback()
    image.classList.remove('swipe-left', 'swipe-right')
    image.classList.add('swipe-in')
    window.setTimeout(function () {
      image.classList.remove('swipe-in')
      cleanBuddyLock = false
    }, 320)
  }, 280)
  return true
}

function showNextCleanBuddy(direction) {
  cleanBuddyIndex = (cleanBuddyIndex + 1) % cleanBuddyProfiles.length
  renderBuddyData()
  return true
}

function likeCleanBuddyNow() {
  saveCleanBuddyMatch(getCleanBuddyProfile())
  showScreen('buddy-match')
  return true
}

function saveCleanBuddyMatch(profile) {
  if (typeof ensureBuddyMatch === 'function') ensureBuddyMatch(profile)
  if (typeof saveBuddyState === 'function') saveBuddyState()
  renderBuddyData()
}

function handleBuddyAction(event) {
  var activeBuddyScreen = document.querySelector('#buddy-discovery.active')
  if (activeBuddyScreen && !closestElement(event.target, 'button')) {
    var point = event.changedTouches && event.changedTouches[0] ? event.changedTouches[0] : event
    var rect = activeBuddyScreen.getBoundingClientRect()
    var x = (point.clientX - rect.left) / rect.width
    var y = (point.clientY - rect.top) / rect.height
    if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
      if (y > .86) {
        event.preventDefault()
        if (x < .20) showScreen('buddy-discovery')
        else if (x < .40) showScreen('buddy-match')
        else if (x < .60) showScreen('buddy-group')
        else if (x < .80) showScreen('buddy-chat')
        else showScreen('buddy-ride')
        return true
      }
      if (y > .77 && y < .89) {
        event.preventDefault()
        if (x < .22) return showNextCleanBuddy('left')
        if (x < .60) {
          saveCleanBuddyMatch(getCleanBuddyProfile())
          showScreen('buddy-chat')
          return true
        }
        if (x < .78) {
          saveCleanBuddyMatch(getCleanBuddyProfile())
          showToast('บันทึก Buddy ที่สนใจแล้ว')
          return true
        }
        return showNextCleanBuddy('left')
        return true
      }
      if (x > .80 && y > .11 && y < .24) {
        event.preventDefault()
        return showNextCleanBuddy('left')
      }
    }
  }

  var nextButton = closestElement(event.target, '[data-buddy-next], [data-next-buddy]')
  if (nextButton) {
    event.preventDefault()
    showNextCleanBuddy('left')
    return true
  }

  var likeButton = closestElement(event.target, '[data-buddy-like], [data-like-buddy]')
  if (likeButton) {
    event.preventDefault()
    showNextCleanBuddy('left')
    return true
  }

  var saveButton = closestElement(event.target, '[data-buddy-save]')
  if (saveButton) {
    event.preventDefault()
    saveCleanBuddyMatch(getCleanBuddyProfile())
    showToast('บันทึก Buddy ที่สนใจแล้ว')
    return true
  }

  var messageOpen = closestElement(event.target, '[data-buddy-message-open]')
  if (messageOpen) {
    saveCleanBuddyMatch(getCleanBuddyProfile())
    return false
  }

  var quickMessage = closestElement(event.target, '[data-buddy-message]')
  if (quickMessage) {
    event.preventDefault()
    appendBuddyMessage(quickMessage.getAttribute('data-buddy-message'))
    return true
  }

  var sendButton = closestElement(event.target, '[data-send-buddy-message]')
  if (sendButton) {
    event.preventDefault()
    var input = document.querySelector('[data-buddy-chat-input]')
    var text = input ? input.value.trim() : ''
    if (!text) return true
    appendBuddyMessage(text)
    input.value = ''
    return true
  }

  return false
}

function getCleanBuddyImage() {
  return document.querySelector('#buddy-discovery.active [data-buddy-card-image]')
}

function beginBuddyDrag(event) {
  return
}

function moveBuddyDrag(event) {
  return
}

function finishBuddyDrag() {
  cleanBuddyDrag = null
  return false
}

function handleCleanBuddyDirectTap(event) {
  var screen = document.querySelector('#buddy-discovery.active, #buddy-discovery-2.active')
    || (/^#buddy-discovery/.test(window.location.hash) ? document.querySelector(window.location.hash) : null)
  if (!screen) return false
  var point = event.changedTouches && event.changedTouches[0] ? event.changedTouches[0] : event
  if (typeof point.clientX !== 'number' || typeof point.clientY !== 'number') return false

  var rect = screen.getBoundingClientRect()
  var x = (point.clientX - rect.left) / rect.width
  var y = (point.clientY - rect.top) / rect.height
  if (x < 0 || x > 1 || y < 0 || y > 1) return false

  var targetScreen = null
  var handled = true

  if (x < .16 && y < .13) {
    targetScreen = 'home'
  } else if (x > .80 && y > .11 && y < .25) {
    showNextCleanBuddy('left')
  } else if (y > .89) {
    if (x < .20) targetScreen = 'buddy-discovery'
    else if (x < .40) targetScreen = 'buddy-match'
    else if (x < .60) targetScreen = 'buddy-group'
    else if (x < .80) targetScreen = 'buddy-chat'
    else targetScreen = 'buddy-ride'
  } else if (y > .76 && y < .89 && x < .23) {
    showNextCleanBuddy('left')
  } else if (y > .76 && y < .89 && x < .60) {
    saveCleanBuddyMatch(getCleanBuddyProfile())
    targetScreen = 'buddy-chat'
  } else if (y > .76 && y < .89 && x < .78) {
    saveCleanBuddyMatch(getCleanBuddyProfile())
    showToast('บันทึก Buddy แล้ว')
  } else if (y > .76 && y < .89) {
    likeCleanBuddyNow()
  } else {
    handled = false
  }

  if (!handled) return false
  event.preventDefault()
  event.stopPropagation()
  if (targetScreen) showScreen(targetScreen)
  lastTouchNavTime = Date.now()
  return true
}

document.addEventListener('touchend', handleCleanBuddyDirectTap, { passive: false, capture: true })
document.addEventListener('click', handleCleanBuddyDirectTap, { passive: false, capture: true })

window.buddyTap = function (action, event) {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }

  if (action === 'home') {
    showScreen('home')
  } else if (action === 'filter') {
    showToast('เปิดตัวกรอง Buddy แล้ว')
  } else if (action === 'next') {
    showNextCleanBuddy('left')
  } else if (action === 'save') {
    saveCleanBuddyMatch(getCleanBuddyProfile())
    showToast('บันทึก Buddy แล้ว')
  } else if (action === 'like') {
    showNextCleanBuddy('left')
  } else if (action === 'find') {
    showScreen('buddy-discovery')
  } else if (action === 'match') {
    showScreen('buddy-match')
  } else if (action === 'group') {
    showScreen('buddy-group')
  } else if (action === 'chat') {
    saveCleanBuddyMatch(getCleanBuddyProfile())
    showScreen('buddy-chat')
  } else if (action === 'ride') {
    showScreen('buddy-ride')
  }

  lastTouchNavTime = Date.now()
  return false
}
