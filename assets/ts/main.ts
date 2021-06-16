window.addEventListener('load', () => {
  /** moble click toggle menu */
  const mobileMenuBtn:Element = document.querySelector('.header-nav--btn')
  mobileMenuBtn.addEventListener('click', function () {
    this.classList.toggle('open')
  })

  /** theme change click */
  const currentTheme:string  = window.localStorage.getItem('theme') || ''
  if (currentTheme && currentTheme !== 'auto') {
    switchTheme(currentTheme)
  }
  const themeLightBtn = document.querySelector('#theme-light')
  const themeDarkBtn  = document.querySelector('#theme-dark')
  const themeAuto     = document.querySelector('#theme-auto')
  themeLightBtn.addEventListener('click', () => switchTheme('light'))
  themeDarkBtn.addEventListener('click', () => switchTheme('dark'))
  themeAuto.addEventListener('click', () => switchTheme('auto'))

  /** background image lazy */
  const lazyBackgrounds = querySelectorArrs('.background-image-lazy')
  let lazyBackgroundsCount = lazyBackgrounds.length
  if (lazyBackgroundsCount > 0) {
    let lazyBackgroundObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function({ isIntersecting, target }) {
        if (isIntersecting) {
          let img = target.dataset.img
          if (img) {
            target.style.backgroundImage = `url(${img})`
          }
          lazyBackgroundObserver.unobserve(target)
          lazyBackgroundsCount --
        }
        if (lazyBackgroundsCount <= 0) {
          lazyBackgroundObserver.disconnect()
        }
      })
    })

    lazyBackgrounds.forEach(function(lazyBackground) {
      lazyBackgroundObserver.observe(lazyBackground)
    })
  }
})

function querySelectorArrs (selector):Array<Element> {
  return Array.from(document.querySelectorAll(selector))
}

function switchTheme (theme) {
  const rootDom:Element = document.documentElement
  if (theme === 'auto') {
    rootDom.classList.remove('theme-dark')
    rootDom.classList.remove('theme-light')
  }
  if (theme === 'dark') {
    rootDom.classList.remove('theme-light')
    rootDom.classList.add('theme-dark')
  }
  if (theme === 'light') {
    rootDom.classList.remove('theme-dark')
    rootDom.classList.add('theme-light')
  }
  window.localStorage.setItem('theme', theme)
}