const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const database = require('./db/database')


app.use(express.static('./public'))
app.use(bodyParser.urlencoded({ extended: true}))


//Search tasks
app.get('/tasks', database.getAllTasks)





app.listen(3000, () => {
    console.log('Server is operating...')
})