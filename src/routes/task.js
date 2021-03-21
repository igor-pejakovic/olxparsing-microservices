const express = require('express')
const taskController = require('../controllers/task')
const router = new express.Router()

router.post('/task', taskController.addTask)
router.get('/task/oldest', taskController.getOldestTask)
router.get('/task/find', taskController.findTask)

module.exports = router