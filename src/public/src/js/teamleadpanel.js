let panelbutton = document.querySelector('#Create_task')
let taskreview = document.querySelector('#Task_review')

panelbutton.addEventListener('click', () => {
    window.location.href = "/panel/createTask"
})

taskreview.addEventListener('click', () => {
    window.location.href = "/panel/reviewTask"
})