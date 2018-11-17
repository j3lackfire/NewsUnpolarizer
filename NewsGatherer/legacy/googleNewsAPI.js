/**
 * Created by Le Pham Minh Duc on 06-Oct-18.
 */
const request = require('request');
const errorHandler = require('./../../errorHandler')

const apiKey = "e8799e5baeb748ca8dc99b2ffc9c156f"
const baseURL = "https://newsapi.org/"
const apiParam = "v2/top-headlines?sources=google-news&apiKey="

function _getRequestURL() {
    return baseURL + apiParam + apiKey
}

function getTopHeadlines(callback) {
    request(_getRequestURL(), (err, res, body) => {
        if (err) {
            errorHandler.logError(err, callback)
        } else {
            let responseBody = JSON.parse(body)
            if (responseBody.status == "ok") {
                let returnList = []
                let articles = responseBody.articles
                for(let i = 0; i < articles.length; i ++) {
                    let returnInfo = {}
                    returnInfo.title = articles[i].title
                    returnInfo.description = articles[i].description
                    returnInfo.url = articles[i].url
                    returnList.push(returnInfo)
                }
                callback(returnList)
            } else {
                errorHandler.logError(responseBody.message, callback)
            }
        }
    })
}

module.exports.getTopHeadlines = getTopHeadlines