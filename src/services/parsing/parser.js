const axios = require('axios')
const { JSDOM } = require('jsdom')

async function retrieveJsdom(url, params = {}){
    const resp = await axios.default.get(url, params)
    return new JSDOM(resp.data)
}

function retrieveItemsDom(dom) {
    const ITEMCONTAINER = 'div.listitem'
    return dom.window.document.querySelectorAll(ITEMCONTAINER)
}

function getItemArray(domItems)
{
    result = []

    domItems.forEach(item => {
        result.push(item)
    })

    return result
}

async function parse(url, params = {}) {
    return getItemArray(retrieveItemsDom(await retrieveJsdom(url, params)))
}

exports.parse = parse