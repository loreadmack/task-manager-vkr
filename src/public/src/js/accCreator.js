let Sbutton = document.querySelector('#Submit')
let Bbutton = document.querySelector('#Back')
let PWD = document.querySelector('#Password')
let RPWD = document.querySelector('#RPassword')
let Login = document.querySelector('#Login')
let Warning = document.querySelector('#Warning')

Sbutton.addEventListener('click', () => {
    let login = document.querySelector('#Login').value
    let password = document.querySelector('#Password').value
    let rpassword = document.querySelector('#RPassword').value
    let FName = document.querySelector('#fname').value
    let LName = document.querySelector('#lname').value
    let Role = document.querySelector('[name="Role"]').value
    
    if (password !== rpassword || password === ''){
        document.querySelector('#Password').value = ''
        document.querySelector('#RPassword').value = ''
        document.querySelector('#Password').classList.add('wrong')
        document.querySelector('#RPassword').classList.add('wrong')
    }
    else {
       let data = {
           Login:login,
           Password:password,
           FName: FName,
           LName: LName,
           Role: Role
       }

       let opt = {
           method: 'post',
           headers: {
               'Content-Type': 'application/json',
           },
           body: JSON.stringify(data)
       }


       let url="/panel/createUser"

       fetch(url, opt)
       .then(response => {
           response.json().then(res => {
               if (res === 'Created') {
                   window.alert(`Account ${login} created`)
               }
               else {
                   if (res.sqlMessage.indexOf('Duplicate') !== -1) {
                       Warning.classList.remove('hide')
                       Login.classList.add('warning')
                   }
                   else {window.alert(res.sqlMessage)}
               }
           })
       }).catch(err => {
           console.log(err)
       })
    }
    
})

Login.addEventListener('click', () => {
    Warning.classList.add('hide')
    Login.classList.remove('warning')
})

PWD.addEventListener('click', () => {
    PWD.classList.remove('warning')
})

RPWD.addEventListener('click', () => {
    RPWD.classList.remove('warning')
})

Bbutton.addEventListener('click', () => {
    window.location.href = '/panel'
})