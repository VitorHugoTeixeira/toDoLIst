const allTasks = []
const divToInsert = document.querySelector('.div-task-content')

//Start application
document.addEventListener('DOMContentLoaded', start)

function start() {
    searchAllTasks(allTasks)
    document.querySelector('#radioInsertTask').addEventListener('click', insertTask)
    document.querySelector('.div-task-content').addEventListener('click', manageTask)
}

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
        
        //Create elements
        let div = document.createElement('div')
        let radio = document.createElement('input')
        let text = document.createElement('input')
        let label = document.createElement('label')
        let iEdit = document.createElement('i')
        let iDelete = document.createElement('i')
        

        //class
        div.classList.add('task-content')
        
        label.classList.add('content-task')
        
        iEdit.classList.add('bi')
        iEdit.classList.add('bi-pen-fill')
        iEdit.classList.add('iconEdit')

        iDelete.classList.add('bi')
        iDelete.classList.add('bi-trash-fill')
        iDelete.classList.add('trashIcon')
        
        text.classList.add('inputTaskText')
        

        //attributes
        radio.setAttribute('id', `inputConluded_${e.id}`)
        radio.setAttribute('type', 'radio')
        label.setAttribute('for', `inputConluded_${e.id}`)
        label.setAttribute('id', `labelText${e.id}`)
        iEdit.setAttribute('id', `editTask_${e.id}`)
        iDelete.setAttribute('id', `deleteTask_${e.id}`)
        text.setAttribute('id', `taskEditText${e.id}`)
        div.setAttribute('id', `divTask${e.id}`)

        //Inserr text
        label.innerHTML = e.text

        if(e.concluded === "true" || e.concluded === true) label.style.textDecoration = "line-through"

        radio.checked = e.concluded == "false" || !e.concluded ? false : true

        //css
        text.style.display = "none"


        //Insert into the div
        divToInsert.appendChild(div)
        div.appendChild(radio)
        div.appendChild(text)
        div.appendChild(label)
        div.appendChild(iEdit)
        div.appendChild(iDelete)

        if(!allTasks.includes(e.id)) allTasks.push(taskArray)
    })
}

async function searchAllTasks(arrayTasks) {
    const resp = await fetch('tasks', { method: 'get' })
    let array = await resp.json()
    
    array.forEach(e => arrayTasks.push(e))

    mountTask(arrayTasks, divToInsert)
}

function concludeTask(input){
    
    id = input.getAttribute('id').split('_')[1]
    const labelContent = document.querySelector(`#labelText${id}`)
    
    allTasks.forEach(e => { 
        if(e.id === parseInt(id)){
            if(e.concluded === input.checked) {
                e.concluded = false
                input.checked = false
                labelContent.style.textDecoration = "none"
            }else {
                e.concluded = input.checked
                labelContent.style.textDecoration = "line-through"
            }
        } 
    })
    
    
    fetch(`tasks`, { method: 'put', headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:`text=${labelContent.textContent}&concluded=${input.checked}&id=${id}`})
}


function manageTask(e){
    if(e.target.id.split('_')[0] == "inputConluded") concludeTask(e.target)
    else if(e.target.id.split('_')[0] == 'editTask') editTask(e.target)
    else if(e.target.id.split('_')[0] == 'deleteTask') deleteTask(e.target)
}

function deleteTask(event){
    
    const id = event.id.split('_')[1]
    
    fetch(`tasks`, { 
        method: 'delete', 
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:`id=${id}`
    })
    
    divToInsert.querySelectorAll('div').forEach(e => {
        if(e.id == `divTask${id}`) divToInsert.removeChild(e)
    })
}


function editTask(value){
    const id = value.id.split('_')[1]
    const labelText = document.querySelector(`#labelText${id}`)
    const inputText = document.querySelector(`#taskEditText${id}`)
    const inputRadio = document.querySelector(`#inputConluded_${id}`)
    const i = document.querySelector(`#editTask_${id}`)
    
    if(value.classList[2] == 'iconEdit'){
        
        labelText.style.display = "none"
        
        inputText.value = labelText.textContent
        inputText.style.display = "block"
        
        i.classList.remove('iconEdit')
        i.classList.remove('bi-pen-fill')
        i.classList.add('bi-check-lg')
        i.classList.add('correctIcon')
        
        disableAllComponents(id, true, 'none')
    }
    else if(value.classList[2] == 'correctIcon'){
        
        fetch(`tasks`, { method: 'put', headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:`text=${inputText.value}&concluded=${inputRadio.checked}&id=${id}`})

        allTasks.forEach(e => { if(e.id == id) e.text = inputText.value })

        labelText.style.display = "block"
        labelText.innerHTML = inputText.value
        
        inputText.style.display = "none"
        
        
        i.classList.remove('bi-check-lg')
        i.classList.remove('correctIcon')
        i.classList.add('bi-pen-fill')
        i.classList.add('iconEdit')
        
        
        disableAllComponents(id, false, 'block')
    }
}

function disableAllComponents(id, disable, visible){

    const all = document.querySelector('.div-task-content')
    const divInsert = document.querySelector('.insert-div')

    if(disable){
        divInsert.querySelectorAll('input').forEach(e => {
            e.setAttribute('disabled', `${disable}`)
        })

        all.querySelectorAll('input').forEach(e => {
            if(e.id != `taskEditText${id}`) e.setAttribute('disabled', `${disable}`)
        })
    }else{
        divInsert.querySelectorAll('input').forEach(e => {
            e.removeAttribute('disabled', `${disable}`)
        })

        all.querySelectorAll('input').forEach(e => {
            if(e.id != `taskEditText${id}`) e.removeAttribute('disabled', `${disable}`)
        })
    }
    
    
    all.querySelectorAll('i').forEach(e => {
        if(e.id != `editTask_${id}`) e.style.display = visible
    })

    

    


}