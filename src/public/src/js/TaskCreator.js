let Submit = document.querySelector('#Submit')





Submit.addEventListener('click', ()=> {
    let Task = document.querySelector('#TaskHeader').value
    let Importance = document.querySelector(`[list='Importance']`).value
    let Urgency = document.querySelector(`[list='Urgency']`).value
    let TaskContext = document.querySelector('#TaskContext').value
    let Employer = document.querySelector(`[list='Employer']`).value
    let Date = document.querySelector('#Date').value
    let LeadId = document.querySelector('#LeadID').innerHTML
    console.log(LeadId)

    let importance = 0
    let urgency = 0

    if (Importance === 'Important') {
        importance = 1
    }
    else {
        importance = 0.5
    }

    if (Urgency === 'Urgently') {
        urgency = 1
    } else {
        urgency = 0.5
    }


    const data = {
        ID: LeadId,
        Title: Task,
        Context: TaskContext,
        Target: Employer,
        Priority: importance*urgency,
        Deadline: Date
    }

    let opt = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }

    let url="/panel/createTask"

    fetch(url, opt)
        .then(response => {
            response.json().then(res => {
                if (res === 'Created') {
                    window.alert(`Task ${Task} created`)
                }
                else {
                    window.alert(res)
                }
            })
        }).catch(err => {
        console.log(err)
    })
    
})