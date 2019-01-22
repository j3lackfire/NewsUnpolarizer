/**
 * Created by Le Pham Minh Duc on 15-Oct-18.
 */
const articlesComparer = require('./Unpolarizer/articlesComparer')
const coreFeatureExtractor = require('./NLPHandler/coreFeatureExtractor')
const nlpAnnotator = require('./NLPHandler/nlpAnnotator')
const openieProcessor = require('./NLPHandler/openieProcessor')
const summarizer = require('./NewsGatherer/summarizer')
const utils = require('./utils')
const dbWriter = require('./LocalDB/dbWriter')

let url = "https://www.theatlantic.com/international/archive/2018/05/akbar-ahmed-islam-europe/559391/"

// articlesComparer.findMostRelevancePairInDb((res) => {
//     // utils.logShortenRelevanceProcessorResult(res)
//     utils.logFullObject(res)
// })

articlesComparer.findMostRelevanceByUrl(url, (err, res) => {
    console.log("Most relevance article is")
    utils.logShortenRelevanceProcessorResult(res)
    // utils.logFullObject(res)
})

// coreFeatureExtractor.extractCoreFeaturesAndEntitiesAndMetaFromUrl(url, (err, res) => {
//     utils.logFullObject(res)
// })

/*
let testPromise = (myParam) => {
    return new Promise((resolve, reject) => {
        console.log("this is the function - " + myParam)
        if (true) {
            resolve("Stuff worked!");
        }
        else {
            reject(Error("It broke"));
        }
    });
}

testPromise("hello world").then((result) => {
    console.log(result); // "Stuff worked!"
}).catch((err) => {
    console.log(err); // Error: "It broke"
});
*/