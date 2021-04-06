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
    }
})

module.exports = Item