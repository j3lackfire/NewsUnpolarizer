/**
 * Created by Le Pham Minh Duc on 15-Oct-18.
 */
const articlesComparer = require('./Unpolarizer/articlesComparer')
const coreFeatureExtractor = require('./NLPHandler/coreFeatureExtractor')
const nlpAnnotator = require('./NLPHandler/nlpAnnotator')
const openieProcessor = require('./NLPHandler/openieProcessor')
const sentimentProcessor = require('./NLPHandler/sentimentProcessor')
const sentimentComparer = require('./Unpolarizer/sentimentComparer')
const summarizer = require('./NewsGatherer/summarizer')
const utils = require('./utils')
const dbWriter = require('./LocalDB/dbWriter')
const dbReader = require('./LocalDB/dbReader')

let url = "https://www.straitstimes.com/asia/se-asia/interracial-harmony-sarawak-church-wedding-with-muslim-bridesmaids"

// coreFeatureExtractor.extractCoreFeaturesAndEntitiesAndMetaFromUrl(url, (err, coreFeature) => {
//     for (let i = 0; i < coreFeature.sentiment.length; i ++) {
//         console.log(coreFeature.sentiment[i].text)
//     }
//     console.log("\nSentiment count: " + coreFeature.sentiment.length)
//     console.log("\nSentence count" + coreFeature.data.length)
// })


// dbReader.readDbAsJson((error, result) => {
//     for (let i = 0; i < result.length; i ++) {
//         articlesComparer.findMostRelevanceByUrl(result[i].meta.url, (err, res) => {
//             let printVal = {}
//             printVal.meta = res[0].meta
//             printVal.entitiesPair = res[0].entitiesPair
//             utils.logFullObject(printVal)
//             console.log(",")
//         })
//     }
// })

function getInfo(annotation) {
    let returnVal = {}
    returnVal.url = annotation.meta.url
    returnVal.title = annotation.meta.title
    returnVal.sentenceLength = annotation.data.length
    returnVal.triplesNumber = 0
    returnVal.entityPairInTriple = 0
    for (let i = 0; i < annotation.data.length; i ++) {
        returnVal.triplesNumber += annotation.data[i].triplets.length
        for (let j = 0; j < annotation.data[i].triplets.length; j ++) {
            if (annotation.data[i].triplets[j].entities.length > 1) {
                returnVal.entityPairInTriple ++
            }
        }
    }
    return returnVal
}

// articlesComparer.findMostRelevanceByUrl(url, (err, res) => {
//     console.log("Most relevance article is")
//     utils.logFullObject(res[0])
// })

