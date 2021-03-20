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

const amqp = require('amqplib/callback_api')
amqp.connect(`amqp://${process.env.AMQP_SERVICE_PARSING_ADRESS}:${process.env.AMQP_SERVICE_PARSING_PORT}`, (error0, connection) => {
    if (error0) {
        throw error0
    }
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1
        }

        const queue = 'parsing'
        var msg = 'https://www.olx.ba/pretraga?kategorija=154&stranica=4'

        channel.assertQueue(queue, {
            durable: false
        })
        channel.sendToQueue(queue, Buffer.from(msg))
        console.log(" [x] Sent %s", msg)
    }
    )
})