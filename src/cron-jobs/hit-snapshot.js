require('dotenv').config()
require('../config/db/mongoose')

const itemHitController = require('../controllers/item-hit')
const Items = require('../models/item')

async function run() {
    itemHitController.addManyHits(Items, Date.now())
}

exports.run = run

run().then(() => {console.log('Insertion complete')})