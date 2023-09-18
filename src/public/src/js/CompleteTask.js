let complete = document.querySelector('#Complete')
let addComment = document.querySelector('#SendComment')

complete.addEventListener('click', ()=> {
    let TaskID = document.querySelector('.TaskID').innerHTML
    let data = {id: TaskID}
    let opt = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }


    let url="/panel/changeStatus"

    fetch(url, opt)
        .then(response => {
            response.json().then(res => {
                if (res === 'Updated') {
                    window.location.href = '/panel'
                    window.alert('Complete')
                }
            })
        }).catch(err => {
        console.log(err)
    })
})

addComment.addEventListener('click', () => {
    let TaskID = document.querySelector('.TaskID').innerHTML
    let UserID = document.querySelector('.UserID').innerHTML
    let comment = document.querySelector('#Comment').value
    let data = {
        TaskID: TaskID,
        UserID: UserID,
        comment: comment
    }

    let opt = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }

    fetch('/panel/createcomment', opt)
        .then(response => {
            response.json().then(res => {
                if (res === 'Created') {
                    location.reload()
                }
                else {
                    window.alert(res)
                }
            })
        }).catch(err => {
        console.log(err)
    })

})