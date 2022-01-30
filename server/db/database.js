const { Pool } = require('pg')
const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'toDoList',
    password: '123456',
    port: 5432,
})


function getAllTasks(request, response){
    pool.query('SELECT * FROM list', (err, result) => {
        if(err) throw `Ocorreu um erro ao consultar as tarefas: ${err.message}`
        else response.send(result.rows)
    })
}

module.exports = { getAllTasks}