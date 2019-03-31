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

let url = "https://www.bbc.com/news/world-europe-47763176" //ukraine news
// let p = "Mr Poroshenko, one of Ukraine's wealthiest oligarchs, was elected in a snap vote after former pro-Russian President Viktor Yanukovych was toppled in the February 2014 Maidan Revolution, which was followed by Russia's annexation of Crimea and a Russian-backed insurgency in the east. The next president will inherit a deadlocked conflict between Ukrainian troops and Russian-backed separatists in the east, while Ukraine strives to fulfil EU requirements for closer economic ties."

let p = "The devastating war in Yemen has gotten more attention recently as outrage over the killing of a Saudi dissident in Istanbul has turned a spotlight on Saudi actions elsewhere. Eight million Yemenis already depend on emergency food aid to survive, he said, a figure that could soon rise to 14 million, or half Yemen's population. The embassy of Saudi Arabia in Washington did not respond to questions about the country's policies in Yemen. The Saudis point out that they, along with the United Arab Emirates, are among the most generous donors to Yemen's humanitarian relief effort. In January, Saudi Arabia deposited $2 billion in Yemen's central bank to prop up its currency. Saudi Arabia's tight control over all air and sea movements into northern Yemen has effectively made the area a prison for those who live there."

nlpAnnotator.annotateParagraph(p, (err, result) => {
    utils.logFullObject(result)
})

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