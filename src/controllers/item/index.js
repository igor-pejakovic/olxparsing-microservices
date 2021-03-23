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

exports.oldestCrawl = async function() {
    return await Items.findOne({}, {}, { sort: { 'lastCrawled' : 1 }})
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