const pages = Array.from(document.querySelectorAll('.app-page'))
const menuOverlay = document.querySelector('.menu-overlay')
const toast = document.querySelector('.toast')
const splashPage = document.querySelector('.splash-page')
let toastTimer

function showToast(message) {
  window.clearTimeout(toastTimer)
  if (!toast) return
  toast.textContent = message
  toast.classList.add('show')
  toastTimer = window.setTimeout(() => {
    toast.classList.remove('show')
  }, 1800)
}

function closeMenu() {
  if (!menuOverlay) return
  menuOverlay.classList.remove('open')
  menuOverlay.setAttribute('aria-hidden', 'true')
}

function openMenu() {
  if (!menuOverlay) return
  menuOverlay.classList.add('open')
  menuOverlay.setAttribute('aria-hidden', 'false')
}

function goToPage(pageId, options = {}) {
  const targetPage = document.getElementById(pageId)
  if (!targetPage) return

  pages.forEach((page) => {
    page.classList.toggle('active', page.id === pageId)
  })
  if (splashPage) splashPage.classList.add('is-hidden')
  closeMenu()

  if (options.updateHash !== false && window.location.hash !== `#${pageId}`) {
    window.history.pushState(null, '', `#${pageId}`)
  }
}

window.goToPage = goToPage

window.setTimeout(() => {
  if (splashPage) splashPage.classList.add('is-hidden')
}, 3900)

document.querySelectorAll('[data-open-menu]').forEach((button) => {
  button.addEventListener('click', openMenu)
})

document.querySelectorAll('[data-close-menu]').forEach((button) => {
  button.addEventListener('click', closeMenu)
})

document.querySelectorAll('[data-go]').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault()
    goToPage(button.dataset.go)
  })
})

document.querySelectorAll('[data-toast]').forEach((button) => {
  button.addEventListener('click', () => {
    showToast(button.dataset.toast)
  })
})

if (menuOverlay) {
  menuOverlay.addEventListener('click', (event) => {
    if (event.target === menuOverlay) closeMenu()
  })
}

window.addEventListener('popstate', () => {
  const pageId = window.location.hash.replace('#', '') || 'home'
  goToPage(pageId, { updateHash: false })
})

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu()
})

const initialPageId = window.location.hash.replace('#', '')
if (initialPageId) {
  goToPage(initialPageId, { updateHash: false })
}
