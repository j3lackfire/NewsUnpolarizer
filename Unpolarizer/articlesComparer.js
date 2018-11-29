/**
 * Created by Le Pham Minh Duc on 17-Nov-18.
 */
const coreFeatureExtractor = require('./../NLPHandler/coreFeatureExtractor')
const dbReader = require('./../LocalDB/dbReader')
const relevanceProcessor = require('./relevanceProcessor')
const utils = require('./../utils')

let cachedDb = null

function _getCachedDb(callback) {
    if (cachedDb == null) {
        dbReader.readDbAsJson((err, annotatedArticles) => {
            if (err) {
                callback(err, null)
            } else {
                cachedDb = annotatedArticles
                callback(null, cachedDb)
            }
        })
    } else {
        callback(null, cachedDb)
    }
}

function _getAnnotatedArticleByUrl(url, callback) {
    _getCachedDb((err, annotatedArticles) => {
        if (err) {
            callback(err, null)
            return
        }
        for (let i = 0; i < annotatedArticles.length; i ++) {
            if (url === annotatedArticles[i].meta.url) {
                callback(null, annotatedArticles[i])
                return
            }
        }
        // The url is not yet annotated and stored in our db
        console.log("The url is not yet annotated - annotating ...")
        coreFeatureExtractor.extractCoreFeaturesAndMetaFromUrl(url, (extractError, annotatedArticle) => {
            if (extractError) {
                console.error("Error getting the core features")
                callback(extractError, null)
            } else {
                callback(null, annotatedArticle)
            }
        })
    })
}

function _findMostRelevanceArticles(sourceAnnotatedArticle, callback) {
    _getCachedDb((err, annotatedArticles) => {
        relevanceProcessor.generateRelevantScoreList(sourceAnnotatedArticle, annotatedArticles, (sortedRelevanceMeta) => {
            callback(null, sortedRelevanceMeta)
        })
    })
}

function findMostRelevanceByUrl(url, callback) {
    _getAnnotatedArticleByUrl(url, (err_1, annotatedArticle) => {
        if (err_1) {
            callback(err_1, null)
        } else {
            _findMostRelevanceArticles(annotatedArticle, callback)
        }
    })
}

function findMostRelevancePairInDb(callback) {
    utils.getAllUrlsInDb((dbUrls) => {
        if (dbUrls == null) {
            console.error("Error with the db")
            callback(null)
        } else {
            _recursiveFindRelevancePairInDb(dbUrls, 0, [], (result) => {
                callback(result)
            })
        }
    })
}

function _recursiveFindRelevancePairInDb(urls, index, returnObject, callback) {
    findMostRelevanceByUrl(urls[index], (err, sortedRelevanceMeta) => {
        returnObject.push(sortedRelevanceMeta[0])
        index ++
        if (index >= urls.length) {
            callback(returnObject)
        } else {
            _recursiveFindRelevancePairInDb(urls, index, returnObject, callback)
        }
    })
}

module.exports.findMostRelevanceByUrl = findMostRelevanceByUrl
module.exports.findMostRelevancePairInDb = findMostRelevancePairInDb