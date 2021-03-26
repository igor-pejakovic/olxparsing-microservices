const mongoose = require('mongoose')

const ItemHit = mongoose.model('ItemHit', {
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    snapshotTime: {
        type: Date,
        required: true,
        default: Date.now()
    },
    hits: {
        type: Number,
        required: true
    }
})

module.exports = ItemHit