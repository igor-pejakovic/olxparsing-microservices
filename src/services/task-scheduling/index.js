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
        sexyBack(queue, channel)()
    })
}))

function sexyBack(queue, channel) {
    return async function cback() {
        setTimeout(cback, 30000)
        try {
            var currentTask = await taskController.oldestTask()
            if (currentTask) {
                channel.sendToQueue(queue, Buffer.from(JSON.stringify({
                    taskId: currentTask._id,
                    URL: currentTask.URL
                })))
                console.log(`Sent to queue ${currentTask.URL}`)
            }
        } catch (e) {
            console.log(e.message)
        }
    }
}