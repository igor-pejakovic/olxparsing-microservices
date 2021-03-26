const ItemHits = require('../../models/item-hit')

exports.addHit = async function(item, snapshotTime = Date.now()) {
    var newHitItem = hitItemFactory(item, snapshotTime)
    newHitItem.save()
}

exports.addManyHits = async function(Items, snapshotTime = Date.now()) {
    var insertion = []
    const itemsAll = await Items.find()
    itemsAll.forEach( item => {
        insertion.push(hitItemFactory(item, snapshotTime))
    })

    ItemHits.insertMany(insertion)
    console.log(`Insertion of ${insertion.length} elements`)
}

function hitItemFactory(item, snapshotTime) {
    var hits = 0
    if(item.hits) {
        hits = item.hits - item.timesHit
    } 
    return new ItemHits({
        itemId: item._id,
        hits: hits,
        snapshotTime: snapshotTime
    })
}