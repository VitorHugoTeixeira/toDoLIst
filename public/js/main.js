//Url
const url = 'http://localhost:3000'

//Start application
document.addEventListener('DOMContentLoaded', start)

function start(){
    document.querySelector('#radioInsertTask').addEventListener('click', insertTask)
}

//Insert task to database and returm an array to insert in my document as new task 
async function insertTask(e){
    const inputInsert = document.querySelector('.insertTask').value
    const divToInsert = document.querySelector('.div-task-content')

    if(inputInsert.toString().replace(/\s/g,"") == "") alert('Fill the task field!') 
    else {
        const resp = await fetch('tasks', { method: 'post', headers: { "Content-Type": "application/x-www-form-urlencoded" }, 
        body: `text=${inputInsert}&concluded=false`})
        
        let arrayAnswers = await resp.json()        
        // mountTask(arrayAnswers, divToInsert)
        console.log(arrayAnswers)
    }

}

function mountTask(taskArray, divToInsert){
    const div = document.createElement('div')
    const radio = document.createElement('input')
    const label = document.createElement('label')

    //class
    div.classList.add('task-content')

    //attibutes
    radio.setAttribute('id', `inputConluded${taskArray[0]}`)
    label.setAttribute('for', `inputConluded${taskArray[0]}`)

    //Insert text
    label.innerHTML = taskArray[1]
    radio.checked = taskArray[2]

    divToInsert.appendChild(div)
    divToInsert.appendChild(radio)
    divToInsert.appendChild(label)

}
