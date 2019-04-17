/**
 * Created by Le Pham Minh Duc on 15-Oct-18.
 */
const articlesComparer = require('./Unpolarizer/articlesComparer')
const coreFeatureExtractor = require('./NLPHandler/coreFeatureExtractor')
const nlpAnnotator = require('./NLPHandler/nlpAnnotator')
const openieProcessor = require('./NLPHandler/openieProcessor')
const sentimentProcessor = require('./NLPHandler/sentimentProcessor')
const summarizer = require('./NewsGatherer/summarizer')
const utils = require('./utils')
const dbWriter = require('./LocalDB/dbWriter')

let url = "https://www.bbc.com/news/world-europe-47763176" //ukraine news

let p = "The devastating war in Yemen has gotten more attention recently as outrage over the killing of a Saudi dissident in Istanbul has turned a spotlight on Saudi actions elsewhere. Eight million Yemenis already depend on emergency food aid to survive, he said, a figure that could soon rise to 14 million, or half Yemen's population. The embassy of Saudi Arabia in Washington did not respond to questions about the country's policies in Yemen. The Saudis point out that they, along with the United Arab Emirates, are among the most generous donors to Yemen's humanitarian relief effort. In January, Saudi Arabia deposited $2 billion in Yemen's central bank to prop up its currency. Saudi Arabia's tight control over all air and sea movements into northern Yemen has effectively made the area a prison for those who live there."

// nlpAnnotator.requestNlpAnnotation(p, (err, nlpAnnotation) => {
//     // utils.logFullObject(nlpAnnotation)
//     sentimentProcessor.extractSentimentsFromNLP(nlpAnnotation, (err_2, result) => {
//         utils.logFullObject(result)
//     })
// })

// coreFeatureExtractor.extractCoreFeaturesAndEntitiesAndMetaFromUrl(url, (err, coreFeature) => {
//     utils.logFullObject(coreFeature)
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

