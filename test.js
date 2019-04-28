/**
 * Created by Le Pham Minh Duc on 15-Oct-18.
 */
const verbDbController = require('./LocalDB/verbDbController')
const verbProcessor = require('./NLPHandler/verbHandler/verbProcessor')
const dbReader = require('./LocalDB/dbReader')
const utils = require('./utils')

dbReader.readDbAsJson((err, res) => {
    let abc = []
    for (let i = 0; i < res[0].data.length; i ++) {
        for (let j = 0; j < res[0].data[i].triplets.length; j ++) {
            let triple = res[0].data[i].triplets[j]
            let verbObject = {}
            verbObject.verb = triple.relationVerb
            verbObject.synonym = triple.verbSynonym
            verbObject.antonym = triple.verbAntonym
            abc.push(verbObject)
        }
    }
    utils.logFullObject(abc)
})