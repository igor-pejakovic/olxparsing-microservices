const Tasks = require('../../models/task')

exports.addTask = async function(req, res, next) {
    try {
        const exists = await Tasks.findOne({URL : req.body.URL})
        if(exists) {
            res.status(303).send(exists)
        }
        else {
            const task = new Task(req.body)

            await task.save()
            res.status(201).send(task)
        }
    } catch (e) {
        res.status(400).send(e)
    }
}

exports.getOldestTask = async function(req, res, next) {
    try {
        // Returns oldest task ordered by lastUpdated
        var task = await Tasks.findOne({}, {}, { sort: { 'lastUpdated' : 1 }})
        if(task) {
            res.status(200).send(task)
        } else {
            res.status(404)
        }
    } catch (e) {
        res.status(400).send(e)
    }
}

exports.findTask = async function(req, res, next) {
    try {
        var task = await Tasks.findOne({URL : req.body.URL})
        if(task) {
            res.status(200).send(task)
        } else {
            res.status(404)
        }
    } catch (e) {
        res.status(400).send(e)
    }
}