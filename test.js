/**
 * Created by Le Pham Minh Duc on 15-Oct-18.
 */
const coreFeatureExtractor = require('./NLPHandler/coreFeatureExtractor')
const summarizer = require('./NewsGatherer/summarizer')
const utils = require('./utils')

let url = "http://www.hurriyetdailynews.com/saudi-suspect-in-khashoggi-case-dies-in-car-accident-report-138007"

summarizer.urlToParagraph(url, (err, p) => {
    if (err) {
        console.error(err)
    } else {
        console.log("Result received from smmry service. Sending to annotator")
        console.log(p)
        coreFeatureExtractor.extractCoreFeatures(p, (err, result) => {
            for (let i = 0; i < result.length; i ++) {
                for (let j = 0; j < result[i].triplets.length; j ++) {
                    console.log(result[i].triplets[j].full)
                }
            }
            utils.logFullObject(result)
        })
    }
})


