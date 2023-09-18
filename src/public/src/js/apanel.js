let create_user = document.querySelector('#Create_user')
let delete_user = document.querySelector('#Delete_user')

create_user.addEventListener('click', () => {
    window.location.href = '/panel/createUser'
})

delete_user.addEventListener('click', () => {
    window.location.href = '/panel/deleteUser'
})