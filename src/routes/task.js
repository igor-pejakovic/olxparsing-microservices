const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

router.post('/task', async(req, res) => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})