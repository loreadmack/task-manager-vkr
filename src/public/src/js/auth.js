let button = document.querySelector('#submit');

button.addEventListener('click', () => {
        let login = document.querySelector('#login').value
        let password = document.querySelector('#password').value
        let data = {login:login, password:password}
        let url = '/login'

        let opt = {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }

        fetch(url, opt).then(response => {
            localStorage.setItem('Authorization', response.headers.get('Authorization'))
            window.location.href = "/panel";
            }).catch(err => {
            console.log(err)
        })

    }
)