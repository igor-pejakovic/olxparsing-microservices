require('dotenv').config()
require('../../config/db/mongoose')
const amqp = require('amqplib/callback_api')
const parser = require('./parser')
const validator = require('validator')
const itemController = require('../../controllers/item/index')
const taskController = require('../../controllers/task')

const DEFAULT_DELAY = 15000

amqp.connect(`amqp://${process.env.AMQP_SERVICE_PARSING_ADRESS}:${process.env.AMQP_SERVICE_PARSING_PORT}`, (error0, connection) => {
    if (error0) {
        throw error0
    }
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1
        }

        const queue = 'parsing'
        channel.assertQueue(queue, {
            durable: false
        })

        console.log('Parsing queue started.')

        channel.consume(queue, async (msg) => {
            await parseFromMessage(msg)
        }, {
            noAck: true
        })
    }
    )
})

let wait = ms => new Promise(resolve => setTimeout(resolve, ms))

async function parseFromMessage(msg) { 
    var message = JSON.parse(msg.content.toString())
    const delay = message.delay ? message.delay: DEFAULT_DELAY
    if (validator.isURL(message.URL)) {
        await wait(delay)
        await doParse(message)
    }
}

async function doParse(message) {
    var items = await parser.parse(message.URL)
    items.forEach(async (item) => {
        item.task = message.taskId
        itemController.addOrUpdate(item)
    })
}