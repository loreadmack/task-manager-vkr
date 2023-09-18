let table = document.querySelector('.main__todos-body')
let tasks = table.querySelectorAll('.task')  
for (const task of tasks){
    task.addEventListener('mouseover', () => {
        task.classList.add('select')
    })
    task.addEventListener('mouseout', () => {
        task.classList.remove('select')
    })
    task.addEventListener('click', () => {
        window.confirm(`You are really wont to send ${task.textContent}?`)
    })
}