const parser = require('../parsing/parser')

exports.crawlItem = crawlItem

async function crawlItem(url) {
    var dom = await parser.retrieveJsdom(url)

    var siteDom = dom.window.document

    const sellerSelector = 'div.vrsta1.vrsta_desno'
    const sellerNameSelector = 'div.username span'
    const sellerQuery = siteDom.querySelector(sellerSelector)

    var sellerURL = sellerQuery.querySelector('a').href
    var seller = sellerQuery.querySelector(sellerNameSelector).innerHTML

    const locationSelector = 'div.op.pop.mobile-lokacija'
    const locationQuery = siteDom.querySelector(locationSelector)

    var location = locationQuery.attributes['data-content'].value

    const hitsOuterSelector = 'span.entypo-eye'
    const hitsSelector = 'div.df2'

    const hitsOuterQuery = siteDom.querySelector(hitsOuterSelector)
    const hitsQuery = hitsOuterQuery.parentNode.parentNode.querySelector(hitsSelector)

    var hits = hitsQuery.innerHTML


    return {
        sellerURL: sellerURL,
        seller: seller,
        location: location,
        hits: hits
    }
}