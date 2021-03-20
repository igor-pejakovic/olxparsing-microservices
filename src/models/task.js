const mongoose = require('mongoose')
const validator = require('validator')

const Task = mongoose.model('Task', {
    URL: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error('URL is invalid.')
            }
        }
    },
    createdOn: {
        type: Date,
        default: Date.now()
    },
    lastUpdated: {
        type: Date,
        default: Date.now(),
        validate(value) {
            if(!validator.isDate(value)) {
                throw new Error('Date is invalid.')
            }
        }
    },
    pagesToCheck:{
        type: Number,
        required: true,
        default: 5,
        validate(value) {
            if(value < 1) {
                throw new Error('pagesToCheck must be greater than 0.')
            }
        }
    }
})

module.exports = Task