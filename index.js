require('dotenv').config()
require('./src/config/db/mongoose')
const express = require('express')
const taskRouter = require('./src/routes/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})