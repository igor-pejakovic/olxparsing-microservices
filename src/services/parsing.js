require('dotenv').config()
const amqp = require('amqplib/callback_api')
console.log()
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

        channel.consume(queue, (msg) => {
            console.log(msg.content.toString())
        }, {
            noAck: true
        })
    }
    )
})