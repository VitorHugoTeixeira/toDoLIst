//Url
const url = 'http://localhost:3000'
const allTasks = []
const divToInsert = document.querySelector('.div-task-content')
//Start application
document.addEventListener('DOMContentLoaded', start)

function start() {
    searchAllTasks(allTasks)
    document.querySelector('#radioInsertTask').addEventListener('click', insertTask)

}

//Insert task to database and returm an array to insert in my document as new task 
async function insertTask(e) {
    const inputInsert = document.querySelector('.insertTask')
    const radioButton = document.querySelector('#radioInsertTask')

    if (inputInsert.value.toString().replace(/\s/g, "") == "") alert('Fill the task field!')
    else {
        const resp = await fetch('tasks', {
            method: 'post', headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `text=${inputInsert.value}&concluded=false`
        })

        let arrayAnswers = []
        arrayAnswers.push(await resp.json())

        mountTask(arrayAnswers, divToInsert)
    }

    //Clean the fields
    radioButton.checked = false
    inputInsert.value = ''

}

function mountTask(taskArray, divToInsert) {

    taskArray.forEach(e => {
        
        let div = document.createElement('div')
        let radio = document.createElement('input')
        let label = document.createElement('label')

        //class
        div.classList.add('task-content')
        label.classList.add('content-task')

        //attibutes
        radio.setAttribute('id', `inputConluded${e.id}`)
        radio.setAttribute('type', 'radio')
        label.setAttribute('for', `inputConluded${e.id}`)

        
        label.innerHTML = e.text
        radio.checked = e.concluded

        divToInsert.appendChild(div)
        div.appendChild(radio)
        div.appendChild(label)

        if(!allTasks.includes(e.id)) allTasks.push(taskArray)
    })
}

//Load the existing tasks
async function searchAllTasks(arrayTasks) {
    const resp = await fetch('tasks', { method: 'get' })
    let array = await resp.json()
    
    array.forEach(e => arrayTasks.push(e))

    mountTask(arrayTasks, divToInsert)
}
