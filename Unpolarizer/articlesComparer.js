/**
 * Created by Le Pham Minh Duc on 17-Nov-18.
 */
const coreFeatureExtractor = require('./../NLPHandler/coreFeatureExtractor')
const dbReader = require('./../LocalDB/dbReader')
const relevanceProcessor = require('./relevanceProcessor')
const utils = require('./../utils')

let cachedDb = null

function getCachedDb(callback) {
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

function getAnnotatedArticleByUrl(url, callback) {
    getCachedDb((err, annotatedArticles) => {
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
        coreFeatureExtractor.extractCoreFeaturesAndEntitiesAndMetaFromUrl(url, (extractError, annotatedArticle) => {
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
    getCachedDb((err, annotatedArticles) => {
        relevanceProcessor.generateRelevantScoreList(sourceAnnotatedArticle, annotatedArticles, (sortedRelevanceMeta) => {
            let returnList = []
            for (let i = 0; i < 10; i ++) {
                if (sortedRelevanceMeta[i].meta.relatedTriplesCount > 0) {
                    returnList.push(sortedRelevanceMeta[i])
                }
            }
            callback(null, returnList)
        })
    })
}

function findMostRelevanceByUrl(url, callback) {
    getAnnotatedArticleByUrl(url, (err_1, annotatedArticle) => {
        if (err_1) {
            callback(err_1, null)
        } else {
            _findMostRelevanceArticles(annotatedArticle, callback)
        }
    })
}


module.exports.findMostRelevanceByUrl = findMostRelevanceByUrl
module.exports.getCachedDb = getCachedDb
module.exports.getAnnotatedArticleByUrl = getAnnotatedArticleByUrl