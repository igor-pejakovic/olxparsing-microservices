const Task = require('../../models/task')

exports.addTask = async function(req, res, next) {
    try {
        console.log(req.body)
        const exists = await Task.findOne({URL : req.body.URL})
        console.log(exists)
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