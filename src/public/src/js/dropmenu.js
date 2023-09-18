let button = document.querySelector('.header__burger-button')
let burger = document.querySelector('.main__burger-body')


button.addEventListener('click', () => {
    burger.classList.toggle('open')
})


