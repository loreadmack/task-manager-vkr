let users = document.querySelectorAll('.UserData')
let BackButton = document.querySelector('#Back')
let DeleteButton = document.querySelector('#Delete')
let error = document.querySelector('.error')
let SearchText = document.querySelector('#Search')
let SearchButton = document.querySelector('#SearchButton')

let active = 0
var data = {}

for (const user of users) {
    user.addEventListener('mouseover', () => {
        if (active === 0) {
            user.classList.add('select')
        }
        
    })
    
    user.addEventListener('mouseout', () => {
        if (active === 0) {
            user.classList.remove('select')
        }
        
    })
    
    user.addEventListener('click', () => {
        if (active === 0) {
            error.classList.add('hide')
            user.classList.add('select')
            let userData = user.innerText.split('\t')



            data = {
                UserId: userData[0],
                Role: userData[1],
                Login: userData[2],
                FName: userData[3],
                LName: userData[4],
            }

            console.log(data)

            active = 1
        } else {
            for (const Clear of users) {
                Clear.classList.remove('select')
            }
            active = 0
            data = {}
        }
        
    })
}

BackButton.addEventListener('click' , () => {
    window.location.href = '/panel'
})

DeleteButton.addEventListener('click' , () => {
    if (Object.keys(data).length === 0){
        error.classList.remove('hide')
    } else {
        let opt = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }

        let url="/panel/deleteUser"

        fetch(url, opt)
            .then(response => {
                response.json().then(res => {
                    if (res === 'Deleted') {
                        window.alert(`Account ${data['Login']} deleted`)
                        window.location.reload()
                    }
                    else {
                        window.alert(res)
                    }
                })
            }).catch(err => {
            console.log(err)
        })
    }
})

SearchButton.addEventListener('click', () => {
    for (const user of users) {
        if (user.innerText.indexOf(SearchText.value) >= 0) {
            user.click()
            user.scrollIntoView()
            break
        }
    }
})
