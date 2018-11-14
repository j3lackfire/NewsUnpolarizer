/**
 * Created by Le Pham Minh Duc on 06-Oct-18.
 */
const errorHandler = require('./../errorHandler')
const dbWriter = require('./dbWriter')
const newsApi = require('./../NewsGatherer/googleNewsAPI')
const summarizer = require('./../NewsGatherer/summarizer')

const nlpAnnotator = require('./../NLPHandler/nlpAnnotator')
const nerProcessor = require('./../NLPHandler/nerProcessor')

function summaryAllNews(newsList, callback) {
    summaryAnnotateAndSaveNews(newsList, 0, callback)
}

function summaryAnnotateAndSaveNews(newsList, currentIndex, callback) {
    //nlpAnnotator.analyzeUrl -> save to db
    console.log("summaryAnnotateAndSaveNews " + currentIndex + " , " + newsList[currentIndex].title)
    nlpAnnotator.analyzeUrl(newsList[currentIndex].url, (err, coreFeatureJson) => {
        console.log("Annotating completed")
        if (err) {
            errorHandler.logError(err, callback)
        } else {
            dbWriter.checkAndWriteToDb(coreFeatureJson, (writeToDbErr) => {
                if (writeToDbErr) {
                    errorHandler.logError(writeToDbErr, callback)
                }else {
                    console.log('The file has been saved!');
                    currentIndex ++
                    if (currentIndex >= newsList.length) {
                        callback(null)
                    } else {
                        summaryAnnotateAndSaveNews(newsList, currentIndex, callback)
                    }
                }
            })
        }
    })
}

function populateDb(callback) {
    newsApi.getTopHeadlines((newsList) => {
        if (newsList == null) {
            errorHandler.logError("Error getting the news from news API", (err) => {})
        } else {
            console.log("Summary all news")
            console.log(newsList)
            summaryAllNews(newsList, callback)
        }
    })
}

// populateDb((err) => {
//     if (!err) {
//         callback("Successfully populate the database with today news!")
//     } else {
//         callback(err)
//     }
// })
