require('dotenv').config()
require('../../config/db/mongoose')
const amqp = require('amqplib/callback_api')
const parser = require('./parser')
const validator = require('validator')
const itemController = require('../../controllers/item/index')

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
            var message = msg.content.toString()
            console.log(`Recieved from queue ${message}`)
            if(validator.isURL(message)) {
                var items = await parser.parse(message)
                items.forEach( (item) => {
                    item.task = msg.properties.task
                    itemController.addOrUpdate(item)
                })
            }
            
        }, {
            noAck: true
        })
    }
    )
})