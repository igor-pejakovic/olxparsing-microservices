const Tasks = require('../../models/task')
const SITE_PREFIX = 'olx.ba/pretraga'

exports.postTask = async function(req, res, next) {
    try {
        if(!req.body.URL.includes(SITE_PREFIX)) {
            res.status(400).send({message: 'Invalid URL'})
            return
        }
        const exists = await Tasks.findOne({URL : req.body.URL})
        if(exists) {
            res.status(303).send(exists)
        }
        else {
            const task = new Tasks(req.body)

            await task.save()
            res.status(201).send(task)
        }
    } catch (e) {
        res.status(400).send(e)
    }
}

exports.findById = async function(id) {
    return await Tasks.findById(id)
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

exports.oldestTask = async function() {
    // Returns oldest task ordered by lastUpdated
    var task = await Tasks.findOne({}, {}, { sort: { 'lastUpdated' : 1 }})
    task.lastUpdated = Date.now()
    await task.save()
    return task
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