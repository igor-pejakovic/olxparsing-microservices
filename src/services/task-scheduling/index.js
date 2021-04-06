require('dotenv').config()
require('../../config/db/mongoose')
const taskController = require('../../controllers/task')
const amqp = require('amqplib/callback_api')



amqp.connect((`amqp://${process.env.AMQP_SERVICE_PARSING_ADRESS}:${process.env.AMQP_SERVICE_PARSING_PORT}`, function (error0, connection) {
    if (error0) {
        throw error0
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1
        }
        var queue = 'parsing'

        channel.assertQueue(queue, {
            durable: false
        })

        channel.assertQueue(queueCrawling, {
            durable: false
        })

        parseQueueing(queue, channel)()
    })
}))

function parseQueueing(queue, channel) {
    return async function cback() {
        try {
            var currentTask = await taskController.oldestTask()
            if (currentTask) {
                channel.sendToQueue(queue, Buffer.from(JSON.stringify({
                    taskId: currentTask._id,
                    URL: currentTask.URL,
                    pagesToCheck: currentTask.pagesToCheck
                })))
                console.log(`Sent to queue ${currentTask.URL}`)
                await wait(PARSING_DELAY)
                cback()
            }
        } catch (e) {
            console.log(e.message)
        }
    }
}
let wait = ms => new Promise(resolve => setTimeout(resolve, ms))
