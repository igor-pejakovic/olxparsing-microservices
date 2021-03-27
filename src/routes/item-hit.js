const express = require('express')
const itemHitController = require('../controllers/item-hit')
const router = new express.Router()

router.get('/item-hit', itemHitController.getHitsFromItem)

module.exports = router