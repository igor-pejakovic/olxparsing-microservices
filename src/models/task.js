const mongoose = require('mongoose')
const validator = require('validator')

const Task = mongoose.model('Task', {
    URL: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error('URL is invalid.')
            }
    },
    createdOn: {
        type: Date,
        default: Date.now()
    },
    lastUpdated: {
        type: Date,
        required: true,
        default: Date.now()
    },
    pagesToCheck:{
        type: Number,
        default: 5,
        validate(value) {
            if(value < 1) {
                throw new Error('pagesToCheck must be greater than 0.')
            }
        }
    }}
})

module.exports = Task