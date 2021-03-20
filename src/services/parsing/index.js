require('dotenv').config()
const amqp = require('amqplib/callback_api')
const parser = require('./parser')
const validator = require('validator')

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
            console.log(msg.content.toString())
            var message = msg.content.toString()
            if(validator.isURL(message)) {
                console.log(await parser.parse(message))
            }
            
        }, {
            noAck: true
        })
    }
    )
})