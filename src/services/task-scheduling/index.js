require('dotenv').config()
require('../../config/db/mongoose')
const taskController = require('../../controllers/task')
const itemController = require('../../controllers/item')
const amqp = require('amqplib/callback_api')

const PARSING_DELAY = 10*60*1000
const CRAWLING_DELAY = 150


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

        //sexyBack(queue, channel)()
        crawlScheduling(queueCrawling, channel)()
    })
}))

function sexyBack(queue, channel) {
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
var count = 0

function crawlScheduling(queue, channel) {
    return async function crawl() {
        try {
            var currentItem = await itemController.oldestCrawl()
            if(currentItem) {
                var timeDiff = Math.floor((Date.now() - currentItem.lastCrawled)/(1000*60))
                console.log(timeDiff)
                if(timeDiff < 2) { // Wait for at least 2 minutes
                    await wait(2*60*1000)
                }

                channel.sendToQueue(queue, Buffer.from(JSON.stringify({
                    itemId: currentItem._id,
                    URL: currentItem.URL
                })))
                count += 1
                console.log(`Sent to queue item ${currentItem.URL} nr ${count}`)
            }
            await wait(CRAWLING_DELAY)
            crawl()
            
        } catch (e) {
            console.log(e.message)
        }
    }
}