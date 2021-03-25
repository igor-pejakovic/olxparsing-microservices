const axios = require('axios')
const { JSDOM } = require('jsdom')

async function retrieveJsdom(url, params = {}) {
    const resp = await axios.default.get(url, params)
    return new JSDOM(resp.data)
}

function retrieveItemsDom(dom) {
    const ITEMCONTAINER = 'div.listitem'
    return dom.window.document.querySelectorAll(ITEMCONTAINER)
}

function getItemArray(domItems) {
    result = []

    domItems.forEach(item => {
        result.push(new Item(item))
    })

    return result
}

async function parse(url, additionalPages = 2) {
    const SPECIAL_SELECTOR = 'div.izdvojen'
    var result = []
    var params = {
        stranica: 1
    }

    while (additionalPages > 0) {
        console.log(`page ${params.stranica} of ${url}`)
        try {
            var pageDom = await retrieveJsdom(url, { params: params })
            var itemsDom = retrieveItemsDom(pageDom)

            result.push(...getItemArray(itemsDom))

            if (!pageDom.window.document.querySelector(SPECIAL_SELECTOR)) {
                additionalPages -= 1
            }

            params.stranica += 1
        } catch (e) {
            console.log(e.message)
        }
        
    }
    return result
}

exports.parse = parse
exports.retrieveJsdom = retrieveJsdom

class Item {
    // Private fields that are site-specific
    #IDPREFIX = 'art_'

    #TITLE = 'naslov'
    #PRICE = 'cijena div.datum'
    #DATE = 'kada'

    #TITLESELECTOR = 'div.' + this.#TITLE + ' a'
    #PRICESELECTOR = 'div.' + this.#PRICE + ' span'
    #DATESELECTOR = 'div.' + this.#DATE

    // Takes in JSDOM object
    constructor(itemJsdom) {

        const titleItem = itemJsdom.querySelector(this.#TITLESELECTOR)
        const priceItem = itemJsdom.querySelector(this.#PRICESELECTOR)
        const dateItem = itemJsdom.querySelector(this.#DATESELECTOR)

        if (titleItem != null) {
            this.itemId = itemJsdom.id.replace(this.#IDPREFIX, '')
            this.title = titleItem.text
            this.URL = titleItem.href
            this.price = priceItem.innerHTML

            // Format date to ISO
            const dateRegex = /\d{2,4}/gm
            const dM = dateItem.title.match(dateRegex) // Format is [ DD, MM, YYYY, HH, MM]
            const dateObject = new Date(`${dM[2]}-${dM[1]}-${dM[0]} ${dM[3]}:${dM[4]}`)

            this.date = dateObject
        }
    }

    // toString() override
    toString() {
        return {
            itemId: this.itemId,
            title: this.title,
            URL: this.URL,
            price: this.price,
            date: this.date
        }
    }
}
