const Items = require('../../models/item')

exports.addOrUpdate = async function(itemData) {
    try {
        const exists = await Items.findOne({itemId : itemData.itemId})
        if(exists) {
            exists.price = itemData.price
            exists.lastChecked = Date.now()
            exists.date = itemData.date
            exists.title = itemData.title

            await exists.save()
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

exports.add = async function(itemData) {
    try {
        const newItem = new Items(itemData)
        
        return await newItem.save()
    } catch (e) {
        console.log(e.message)
        return undefined
    }
}