const mongoose = require('mongoose')
console.log('Connectiong to db.')
mongoose.connect(`mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
console.log(`Successfully connected on ${process.env.MONGODB_HOST}`)