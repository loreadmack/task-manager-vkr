let create = document.querySelector('.Create')
let login = document.querySelector('#login')
let password = document.querySelector('#password')
let rpassword = document.querySelector('#rpassword')

create.addEventListener('click', () => {
    if (login.value === '') {
        document.querySelector('.login').classList.remove('hidden')
        login.classList.add('incorrect')
    } else {
        if (password.value === '') {
            document.querySelector('.password').classList.remove('hidden')
            password.classList.add('incorrect')
        } else {
            if (password.value !== rpassword.value) {
                document.querySelector('.rpassword').classList.remove('hidden')
                rpassword.classList.add('incorrect')
            } else {
                let data = {login:login.value, password:password.value}
                let url = '/register'
                let opt = {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }

                fetch(url, opt)
                    .then(response => {
                        console.log(response)
                        if (response.status === 200){
                            window.location.replace("/login")
                        }
                    })
            }
        }
    }
})

login.addEventListener('click', () => {
    document.querySelector('.login').classList.add('hidden')
    login.classList.remove('incorrect')
})

password.addEventListener('click', () => {
    document.querySelector('.password').classList.add('hidden')
    password.classList.remove('incorrect')
})

rpassword.addEventListener('click', () => {
    document.querySelector('.rpassword').classList.add('hidden')
    rpassword.classList.remove('incorrect')
})
