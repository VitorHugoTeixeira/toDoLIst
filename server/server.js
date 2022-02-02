const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const database = require('./db/database')


app.use(express.static('./public'))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


//Search tasks
app.get('/tasks', database.getAllTasks)

//Insert task
app.post('/tasks', database.insertTask)

//Update task
app.put('/tasks', database.updatedTask)

//Delete task
app.delete('/tasks', database.deleteTask)




app.listen(3000, () => {
    console.log('Server is operating...')
})