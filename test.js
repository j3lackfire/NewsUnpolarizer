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

let url = "http://www.atimes.com/article/why-the-west-wont-act-on-chinas-uighur-crisis/"


sentimentComparer.getTopRelevantArticle(url, (validList) => {
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


// dbReader.readDbAsJson((err, annotatedArticles) => {
//     for (let i = 0; i < annotatedArticles.length; i ++) {
//         console.log(utils.isNullOrUndefined(annotatedArticles[i].meta.title) ? annotatedArticles[i].meta.url : annotatedArticles[i].meta.title)
//     }
//     console.log("\nTotal: " + annotatedArticles.length)
// })