const { get } = require('express/lib/response')
const { Pool } = require('pg')
const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'todolist',
    password: '123456',
    port: 5432
})


function generateNewId(response, text, concluded){
    pool.query('SELECT MAX(id) FROM list', (err, result) => {
        if(err) throw `There was an error in querying max id of database: ${err}`
        else response.status(200).send({ id: result.rows[0].max ,text: text, concluded: concluded })
    })
}


function getAllTasks(request, response){
    pool.query('SELECT * FROM list ORDER BY id', (err, result) => {
        if(err) throw `There was an error querying tasks: ${err}`
        else response.status(200).send(result.rows)
    })
}

function insertTask(request, response){
    const {text, concluded} = request.body
    
    pool.query('INSERT INTO List (text, concluded) VALUES ($1, $2)', [text, concluded], (err, result) => {
        if(err) throw `There was an error insert the task: ${err}`
    })

    generateNewId(response, text, concluded)
}

function updatedTask(request, response){
    const {text, concluded, id} = request.body
    
    pool.query('UPDATE list set text=$1, concluded=$2 where ID=$3', [text,concluded, id], (err, result) => {
        if(err) throw `There was an error update the task: ${err}`
        else response.status(200).send('Task updated!')

    })
}

function deleteTask(request, response){
    const {id} = request.body

    pool.query('DELETE FROM list WHERE ID=$1', [id], (err, result) => {
        if(err) throw `There was an error delete the task: ${err}`
        else response.status(200).send('Task was deleted!')
    })
}
 
module.exports = { getAllTasks, insertTask, updatedTask, deleteTask}

