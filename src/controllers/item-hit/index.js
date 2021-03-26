const ItemHits = require('../../models/item-hit')

exports.addHit = async function(item, snapshotTime = Date.now()) {
    var newHitItem = hitItemFactory(item, snapshotTime)
    newHitItem.save()
}

exports.addAllHits = async function(Items, snapshotTime = Date.now()) {
    var insertion = []
    const itemsAll = await Items.find()
    itemsAll.forEach( item => {
        insertion.push(hitItemFactory(item, snapshotTime))
    })

    ItemHits.insertMany(insertion)
}

function hitItemFactory(item, snapshotTime) {
    return new ItemHits({
        itemId: item._id,
        hits: item.hits - timesHit,
        snapshotTime: snapshotTime
    })
}