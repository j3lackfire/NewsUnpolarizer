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


// sentimentComparer.getTopUnpolarizeArticle(url, (validList) => {
//     utils.logFullObject(validList)
// })

sentimentComparer.getTopUnpolarizeArticle(url, (validList) => {
    utils.logFullObject(validList)
})


// coreFeatureExtractor.extractCoreFeaturesAndEntitiesAndMetaFromUrl(url, (err, coreFeature) => {
//     for (let i = 0; i < coreFeature.sentiment.length; i ++) {
//         console.log(coreFeature.sentiment[i].text)
//     }
//     console.log("\nSentiment count: " + coreFeature.sentiment.length)
//     console.log("\nSentence count" + coreFeature.data.length)
// })


// articlesComparer.findMostRelevancePairInDb((res) => {
//     utils.logShortenRelevanceProcessorResult(res)
//     // utils.logFullObject(res)
// })

// articlesComparer.findMostRelevanceByUrl(url, (err, res) => {
//     console.log("Most relevance article is")
//     // utils.logShortenRelevanceProcessorResult(res)
//     utils.logFullObject(res)
// })

