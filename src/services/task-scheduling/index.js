require('dotenv').config()
require('../../config/db/mongoose')
const taskController = require('../../controllers/task')
const itemController = require('../../controllers/item')
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
        var queueCrawling = 'crawling'

        channel.assertQueue(queue, {
            durable: false
        })

        channel.assertQueue(queueCrawling, {
            durable: false
        })

        // sexyBack(queue, channel)()
        crawlScheduling(queueCrawling, channel)()
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

function crawlScheduling(queue, channel) {
    return async function crawl() {
        try {
            var currentItem = await itemController.oldestCrawl()
            var timeDiff = Math.floor((Date.now() - currentItem.lastCrawled)/(1000*60))
            console.log(timeDiff)
            if(timeDiff < 1) { // Wait for at least 15 minutes
                
                setTimeout(() => {console.log('Crawl Waiting...')}, 15*60*1000)
            }

            channel.sendToQueue(queue, Buffer.from(JSON.stringify({
                itemId: currentItem._id,
                URL: currentItem.URL
            })))
            console.log(`Sent to queue item ${currentItem.URL}`)
            //crawl()
            
        } catch (e) {
            console.log(e.message)
        }
    }
}