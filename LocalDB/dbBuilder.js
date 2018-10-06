/**
 * Created by Le Pham Minh Duc on 06-Oct-18.
 */
const errorHandler = require('./../errorHandler')
const newsApi = require('./../NewsGatherer/googleNewsAPI')
const summarizer = require('./../NewsGatherer/summarizer')

newsApi.getTopHeadlines((newsList) => {
    if (newsList == null) {
        errorHandler.logError("Error getting the news from news API", (err) => {})
    } else {
        console.log("Summary all news")
        console.log(newsList)
        summaryAllNews(newsList, (err, returnList) => {
            console.log(returnList)
        })
    }
})

function summaryAllNews(newsList, callback) {
    summaryNewsSingle(newsList, [], 0, callback)
}

function summaryNewsSingle(newsList, returnList, currentIndex, callback) {
    console.log("summaryNewsSingle " + currentIndex + " , " + newsList[currentIndex].title)
    summarizer.summaryUrl(newsList[currentIndex].url, -1, (err, response) => {
        if (err) {
            errorHandler.logError("Error in summarizing the news", callback)
        } else {
            console.log(response)
            returnList.push(response)
            currentIndex += 1
            if (currentIndex >= newsList.length) {
                callback(null, returnList)
            } else {
                summaryNewsSingle(newsList, returnList, currentIndex, callback)
            }
        }
    })
}
