const { Pool } = require('pg')
const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'todolist',
    password: '123456',
    port: 5432
})


function getAllTasks(request, response){
    pool.query('SELECT * FROM list', (err, result) => {
        if(err) throw `There was an error querying tasks: ${err}`
        else response.status(200).send(result.rows)
    })
}

function insertTask(request, response){
    const {text, concluded} = request.body
    pool.query('INSERT INTO List (text, concluded) VALUES ($1, $2)', [text, concluded], (err, result) => {
        if(err) throw `There was an error insert the task: ${err}`
        else{
            response.status(200).send([pool.query('SELECT MAX(id) from list', (err, result) => {
                return result.rows
            }) ,text, concluded])
        } 
        
    })
}

function updatedTask(request, response){
    const id = parseInt(request.params.id)
    const [text, concluded] = request.body

    pool.query('UPDATE list set text=$1, concluded=$2 where ID=$3', [text,concluded, id], (err, result) => {
        if(err) throw `There was an error update the task: ${err}`
        else response.status(200).send([id, text, concluded])
    })
}

function deleteTask(request, response){
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM list WHERE ID=$1', [id], (err, result) => {
        if(err) throw `There was an error delete the task: ${err}`
        else response.status(200).send('Task was deleted!')
    })
}



module.exports = { getAllTasks, insertTask, updatedTask, deleteTask}