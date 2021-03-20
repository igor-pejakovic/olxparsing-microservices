const mongoose = require('mongoose')
const validator = require('validator')

const Item = mongoose.model('Item', {
    URL: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error('URL is invalid.')
            }
    },
    itemId: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Decimal128
    },
    date: {
        type: Date,
        required: true
    },
    lastChecked: {
        type: Date,
        required: true,
        default: Date.now()
    }}
})

module.exports = Item