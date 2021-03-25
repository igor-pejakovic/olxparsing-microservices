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
        }
    },
    itemId: {
        type: Number,
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: String
    },
    date: {
        type: Date,
        required: true
    },
    lastChecked: {
        type: Date,
        required: true,
        default: Date.now()
    },
    task:{
        type: mongoose.Schema.Types.ObjectId, 
        ref:'Task'
    },
    hits: {
        type: Number
    },
    seller: {
        type: String
    },
    sellerURL: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    },
    location: {
        type: String
    },
    lastCrawled: {
        type: Date,
        default: Date.UTC(0)
    },
    timesHit: {
        type: Number,
        default: 0
    }
})

module.exports = Item