const pages = Array.from(document.querySelectorAll('.app-page'))
const menuOverlay = document.querySelector('.menu-overlay')
const toast = document.querySelector('.toast')
let toastTimer

function showToast(message) {
  window.clearTimeout(toastTimer)
  toast.textContent = message
  toast.classList.add('show')
  toastTimer = window.setTimeout(() => {
    toast.classList.remove('show')
  }, 1800)
}

function closeMenu() {
  menuOverlay.classList.remove('open')
  menuOverlay.setAttribute('aria-hidden', 'true')
}

function openMenu() {
  menuOverlay.classList.add('open')
  menuOverlay.setAttribute('aria-hidden', 'false')
}

function goToPage(pageId) {
  pages.forEach((page) => {
    page.classList.toggle('active', page.id === pageId)
  })
  closeMenu()
}

document.querySelectorAll('[data-open-menu]').forEach((button) => {
  button.addEventListener('click', openMenu)
})

document.querySelectorAll('[data-close-menu]').forEach((button) => {
  button.addEventListener('click', closeMenu)
})

document.querySelectorAll('[data-go]').forEach((button) => {
  button.addEventListener('click', () => {
    goToPage(button.dataset.go)
  })
})

document.querySelector('.hotspot.start').addEventListener('click', () => {
  goToPage('login')
})

document.querySelector('.hotspot.family').addEventListener('click', () => {
  goToPage('family')
})

document.querySelectorAll('[data-toast]').forEach((button) => {
  button.addEventListener('click', () => {
    showToast(button.dataset.toast)
  })
})

menuOverlay.addEventListener('click', (event) => {
  if (event.target === menuOverlay) closeMenu()
})

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu()
})
