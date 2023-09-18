
let tables = document.querySelectorAll('.main__todos-body_todo-list')
for (const table of tables){
    let task = table.querySelector('.task')
    task.addEventListener('mouseover', () => {
        task.classList.add('select')
    })
    task.addEventListener('mouseout', () => {
        task.classList.remove('select')
    })
    task.addEventListener('click', () => {
        let ID = table.querySelector('.ID').innerHTML
        window.location.href = `/panel/task${ID}`
    })
}