/**
 * Created by Le Pham Minh Duc on 17-Apr-19.
 */
const articlesComparer = require('./articlesComparer')
const utils = require('./../utils')
const dbReader = require('./../LocalDB/dbReader')

MIN_SIMILARITY = 0.06

function getTopUnpolarizeArticle(url, callback) {
    _generateSentimentEntityScoreList(url, (sentimentEntityScoreList) => {
        let validList = []
        for (let i = 0; i < sentimentEntityScoreList.length; i ++) {
            if (sentimentEntityScoreList[i].similarityScore > MIN_SIMILARITY) {
                validList.push(sentimentEntityScoreList[i])
            }
        }
        validList.sort((a, b) => b.unpolarizeScore - a.unpolarizeScore).slice(0, 10)
        callback(validList)
    })
}

function getTopRelevantArticle(url, callback) {
    _generateSentimentEntityScoreList(url, (sentimentEntityScoreList) => {
        let returnList = sentimentEntityScoreList
        returnList.sort((a, b) => b.relevantScore - a.relevantScore)
        callback(returnList.slice(0, 5))
    })
}

function _generateSentimentEntityScoreList(url, callback) {
    articlesComparer.getCachedDb((err_0, allArticles) => {
        articlesComparer.getAnnotatedArticleByUrl(url, (err_1, annotatedArticle) => {
            _recursiveCompareAllArticles(annotatedArticle, allArticles, 0, [], callback)
        })
    })
}

function _recursiveCompareAllArticles(sourceArticle, allArticles, index, returnObject, callback) {
    _compareArticle(sourceArticle, allArticles[index], (returnResult) => {
        if (returnResult != null) {
            returnObject.push(returnResult)
        }
        index ++
        if (index >= allArticles.length) {
            callback(returnObject)
        } else {
            _recursiveCompareAllArticles(sourceArticle, allArticles, index, returnObject, callback)
        }
    })
}

function _compareArticle(sourceArticle, targetArticle, callback) {
    if (sourceArticle.meta.url == targetArticle.meta.url) {
        callback(null)
        return
    }
    let similarSentimentList = []
    for (let i = 0; i < sourceArticle.sentiment.length; i ++) {
        for (let j = 0; j < targetArticle.sentiment.length; j ++) {
            if (!_isSentimentEntityAdded(similarSentimentList, sourceArticle.sentiment[i])
                && _isSameSentimentEntity(sourceArticle.sentiment[i], targetArticle.sentiment[j])) {
                let sentimentEntity = {}
                sentimentEntity.text = sourceArticle.sentiment[i].text
                sentimentEntity.ner = sourceArticle.sentiment[i].ner
                sentimentEntity.deltaSentiment = Math.abs(sourceArticle.sentiment[i].sentimentValue - targetArticle.sentiment[j].sentimentValue)
                similarSentimentList.push(sentimentEntity)
            }
        }
    }
    let returnValue = {}
    returnValue.sourceUrl = sourceArticle.meta.url
    returnValue.sourceTitle = sourceArticle.meta.title
    returnValue.url = targetArticle.meta.url
    returnValue.title = targetArticle.meta.title
    returnValue.similarEntityNumber = similarSentimentList.length
    returnValue.differentEntityNumber = sourceArticle.sentiment.length + targetArticle.sentiment.length - 2 * similarSentimentList.length
    //Number A in our thesis
    returnValue.similarityScore = returnValue.similarEntityNumber / (returnValue.similarEntityNumber + returnValue.differentEntityNumber)
    let totalViewPointDiff = 0
    for (let i = 0; i < similarSentimentList.length; i ++) {
        totalViewPointDiff += similarSentimentList[i].deltaSentiment
    }
    returnValue.viewpointDifferent = totalViewPointDiff / similarSentimentList.length
    returnValue.unpolarizeScore = (returnValue.similarityScore * returnValue.viewpointDifferent) / 4
    returnValue.relevantScore = 2 * returnValue.similarEntityNumber <= returnValue.differentEntityNumber ?
        (2 * returnValue.similarEntityNumber) / returnValue.differentEntityNumber : returnValue.differentEntityNumber / (2 * returnValue.similarEntityNumber)

    callback(returnValue)
}

function _isSameSentimentEntity(sentiment_1, sentiment_2) {
    return (sentiment_1.text == sentiment_2.text
            && sentiment_1.ner == sentiment_2.ner)
}

function _isSentimentEntityAdded(similarSentimentList, sentimentEntity) {
    for (let i = 0; i < similarSentimentList.length; i++) {
        if (_isSameSentimentEntity(similarSentimentList[i], sentimentEntity)) {
            return true
        }
    }
    return false
}

module.exports.getTopMostSimilarArticle = getTopMostSimilarArticle
module.exports.getTopRelevantArticle = getTopRelevantArticle
module.exports.getTopUnpolarizeArticle = getTopUnpolarizeArticle