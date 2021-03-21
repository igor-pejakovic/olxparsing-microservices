const Items = require('../../models/item')

exports.addOrUpdate = async function(itemData) {
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
}