const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const database = require('./db/database')


app.use(express.static('./public'))

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true}))


//Search tasks
app.get('/tasks', database.getAllTasks)

//Insert task
app.post('/tasks', database.insertTask)

//Update task
app.put('/tasks:id', database.updatedTask)

//Delete task
app.delete('/tasks:id', database.deleteTask)




app.listen(3000, () => {
    console.log('Server is operating...')
})