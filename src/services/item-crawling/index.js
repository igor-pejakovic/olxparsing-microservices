require('dotenv').config()
require('../../config/db/mongoose')
const amqp = require('amqplib/callback_api')
const crawler = require('./crawler')
const validator = require('validator')
const itemController = require('../../controllers/item/index')

amqp.connect(`amqp://${process.env.AMQP_SERVICE_CRAWLING_ADRESS}:${process.env.AMQP_SERVICE_CRAWLING_PORT}`, (error0, connection) => {
    if (error0) {
        throw error0
    }
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1
        }

        const queue = 'crawling'
        channel.assertQueue(queue, {
            durable: false
        })

        console.log('Crawling queue started.')

        channel.consume(queue, async (msg) => {
            await crawlFromMessage(msg)
        }, {
            noAck: true
        })
    }
    )
})

async function crawlFromMessage(msg) { 
    try {
    var message = JSON.parse(msg.content.toString())
    console.log(message)
    if (validator.isURL(message.URL)) {
        var item = await itemController.findById(message.itemId)
        const additionalInfo = await crawler.crawlItem(message.URL)
        additionalInfo.timesHit = item.timesHit + 1

        await item.updateOne(additionalInfo)
    }
    } catch (e) {
        console.log(e.message)
    }
}