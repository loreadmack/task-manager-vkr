let tasks = document.querySelectorAll('.main__teamlead_review_panel__tasks')

for (let tasklist of tasks) {
    let alltask = tasklist.querySelectorAll('.main__teamlead_review_panel__task')
    for (let task of alltask) {
        task.querySelector('.task').addEventListener('click', () => {
            task.querySelector('.context').classList.toggle('hide')
            let sendComment = task.querySelector('#SendComment')

            sendComment.addEventListener('click', () => {
                let UserID = document.querySelector('#LeadID').innerHTML
                let TaskID = task.querySelector('#TaskID').innerHTML
                let comment = task.querySelector('.comment').value
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

            task.querySelector('#Reject').addEventListener('click', () => {
                let title = task.querySelector('.title').innerHTML
                let data = {
                    ID: task.querySelector('.hideID').innerHTML
                }

                let opt = {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                }

                fetch('/panel/rejectreview', opt).then(response => {
                    response.json().then(res => {
                        if (res === 'Updated') {
                            window.location.reload()
                            window.alert(`Task ${title} rejected`)
                        }
                        else {
                            window.alert(res)
                        }
                    })
                }).catch(err => {
                    console.log(err)
                })
            })

            task.querySelector('#Accept').addEventListener('click', () => {
                let title = task.querySelector('.title').innerHTML
                let data = {
                    ID: task.querySelector('.hideID').innerHTML
                }

                let opt = {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                }

                fetch('/panel/acceptreview', opt).then(response => {
                    response.json().then(res => {
                        if (res === 'Accepted') {
                            window.location.reload()
                            window.alert(`Task ${title} accepted`)
                        }
                        else {
                            window.alert(res)
                        }
                    })
                }).catch(err => {
                    console.log(err)
                })
            })
        })


    }
}

let back = document.querySelector('#back')
back.addEventListener('click', () => {
    window.location.href = '/panel'
})





