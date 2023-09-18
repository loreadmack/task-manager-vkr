let button = document.querySelector('.Continue')
let slider1 = document.querySelector('.main__welcome')
let slider2 = document.querySelector('.main__create-admin-account')
button.addEventListener('click', () => {
    slider1.classList.add('hidden')
    slider2.classList.remove('hidden')
})
