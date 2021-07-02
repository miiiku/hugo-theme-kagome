(function () {
  
  const currentTheme:string  = window.localStorage.getItem('theme') || ''
  if (currentTheme && currentTheme !== 'auto') {
    switchTheme(currentTheme)
  }

  window.addEventListener('load', () => {
    /** moble click toggle menu */
    const mobileMenuBtn:Element = document.querySelector('.header-nav--btn')
    mobileMenuBtn.addEventListener('click', function () {
      this.classList.toggle('open')
    })

    /** theme change click */
    const themeLightBtn = document.querySelector('#theme-light')
    const themeDarkBtn  = document.querySelector('#theme-dark')
    const themeAuto     = document.querySelector('#theme-auto')
    themeLightBtn.addEventListener('click', () => switchTheme('light'))
    themeDarkBtn.addEventListener('click', () => switchTheme('dark'))
    themeAuto.addEventListener('click', () => switchTheme('auto'))

    /** background image lazy */
    const lazyBackgrounds = querySelectorArrs('[background-image-lazy]')
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

    /** aplayer init */
    aplayerInit()
    /** dplayer init */
    dplayerInit()
  });
})();

function toCamel(str:string) {
  const arrs = str.split('-')
  if (arrs.length === 1) return arrs[0]
  return arrs.reduce((accumulator:string, currentValue:string) => {
    return accumulator + currentValue.toLowerCase().replace(/( |^)[a-z]/g, v => v.toUpperCase())
  })
}

/**
 * 处理aplayer || dplayer 参数
 * @param el aplayer || dplayer dom
 * @returns 配置项参数
 */
function formatAttr(el:Element): object {
  const config = {}
  const numberList = ['lrcType']
  const boolMap = new Map([
    ['true', true],
    ['false', false],
  ])
  const attrs = el.getAttributeNames().filter(key => key.startsWith('config-'))
  attrs.forEach(attr => {
    const key = toCamel(attr.replace('config-', ''))
    const value = el.getAttribute(attr)
    const toBool = boolMap.get(value)
    
    if (toBool !== undefined) {             /** 处理bool值 */
      config[key] = toBool
    } else if (numberList.includes(key)) {  /** 处理number值 */
      config[key] = parseInt(value)
    } else {                                /** string */
      config[key] = value
    }
  })
  return config
}

function querySelectorArrs (selector:string):Array<Element> {
  return Array.from(document.querySelectorAll(selector))
}

function switchTheme (theme:string) {
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

function aplayerInit () {
  const aplayers = querySelectorArrs('.aplayer-box')
  if (aplayers.length && APlayer) {
    aplayers.forEach(el => {
      const params = { container: el, audio: { ...el.dataset } }
      const config = formatAttr(el)
      new APlayer(Object.assign({}, config, params))
    })
  }
}

function dplayerInit () {
  const dplayers = querySelectorArrs('.dplayer-box')
  if (dplayers.length && DPlayer) {
    dplayers.forEach(el => {
      const params = { container: el, video: { ...el.dataset } }
      const config = formatAttr(el)
      new DPlayer(Object.assign({}, config, params))
    })
  }
}