window.onload = () => {
  const mobileMenuBtn = document.querySelector('.header-nav--btn')

  mobileMenuBtn.addEventListener('click', function () {
    this.classList.toggle('open')
  })
}