require('dotenv').config()
require('./src/config/db/mongoose')
const express = require('express')
const taskRouter = require('./src/routes/task')
const itemRouter = require('./src/routes/item')
const itemHitRouter = require('./src/routes/item-hit')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(taskRouter)
app.use(itemRouter)
app.use(itemHitRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})