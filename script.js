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

menuLayer?.addEventListener('click', (event) => {
  if (event.target === menuLayer) closeMenu()
})

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu()
})

window.addEventListener('popstate', () => {
  showScreen(window.location.hash.replace('#', '') || 'login', { updateHash: false })
})

window.setTimeout(() => {
  showScreen(window.location.hash.replace('#', '') || 'login', { updateHash: false })
}, 2000)
