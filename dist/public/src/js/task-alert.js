let buttons = document.querySelectorAll('.main__group-body_role')
for (const b of buttons){
    b.addEventListener('mouseover', ()=> {
        b.querySelector('.main__group-body_task-alert').classList.add('visible')
    })
    b.addEventListener('mouseout', () => {
        b.querySelector('.main__group-body_task-alert').classList.remove('visible')
    })
}