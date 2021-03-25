const express = require('express')
const itemController = require('../controllers/item')
const router = new express.Router()

router.get('/item/top', itemController.getTopItems)

module.exports = router