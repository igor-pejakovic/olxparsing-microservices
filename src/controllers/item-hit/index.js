const ItemHits = require('../../models/item-hit')
var ObjectId = require('mongoose').Types.ObjectId; 

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

exports.getHitsFromItem = async function(req, res, next) {
    if(!req.query.itemId) {
        res.status(400).send({message: 'Parameter itemId is required.'})
        return
    }
    try {
            var result = await hitsFromItem(req.query.itemId)
            res.status(200).send(result)
    } catch (e) {
        res.status(400).send(e)
    }
}

async function hitsFromItem(itemId) {
    console.log(itemId)
    return ItemHits.find({itemId: new ObjectId(itemId)})
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
