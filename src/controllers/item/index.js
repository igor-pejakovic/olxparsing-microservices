const Items = require('../../models/item')

exports.addOrUpdate = async function(itemData) {
    try {
        const exists = await Items.findOne({itemId : itemData.itemId})
        if(exists) {
            exists.price = itemData.price
            exists.lastChecked = Date.now()
            exists.date = itemData.date
            exists.title = itemData.title

            await exists.updateOne()
            return exists
        } else {
            const newItem = new Items(itemData)
            await newItem.save()
            return newItem
        }
    } catch (e) {
        return undefined
    }
}

exports.getTopItems = async function(req, res, next) {
    try {
            var result = await Items.find({}, {}, { sort: {'hits' : -1}}).limit(50)
            res.status(201).send(result)
    } catch (e) {
        res.status(400).send(e)
    }

}

exports.oldestCrawl = async function() {
    var item = await Items.findOne({}, {}, { sort: { 'lastCrawled' : 1 }})
    await item.updateOne({lastCrawled : Date.now()})
    return item
}

exports.updateOne = async function(item) {
    await Items.updateOne(item)
}

exports.findById = async function(id) {
    return Items.findById(id)
}

exports.add = async function(itemData) {
    try {
        const newItem = new Items(itemData)
        
        return await newItem.save()
    } catch (e) {
        console.log(e.message)
        return undefined
    }
}