/**
 * Created by Le Pham Minh Duc on 25-Nov-18.
 */
const utils = require('./../utils')

function generateRelevantScoreList(sourceArticle, articleList, callback) {
    _recursiveGetRelevantScore(0, sourceArticle, articleList, [], (relevantMetaList) => {
        callback(relevantMetaList)
    })
}

function _recursiveGetRelevantScore(index, sourceArticle, articleList, metaList, callback) {
    let returnMetaList = metaList
    _getRelevantScore(sourceArticle, articleList[index], (relevanceMeta) => {
        if (relevanceMeta != null) { //if it's the same article
            returnMetaList.push(relevanceMeta)
        }
        if (index >= articleList.length - 1) {
            callback(returnMetaList)
        } else {
            _recursiveGetRelevantScore(index + 1, sourceArticle, articleList, returnMetaList, callback)
        }
    })
}

function _getRelevantScore(sourceArticle, targetArticle, callback) {
    if (sourceArticle.meta.url === targetArticle.meta.url) {
        callback(null)
    } else {
        //some weird comparision function here, including ner in subject/object
        let returnMeta = {}
        returnMeta.sourceUrl = sourceArticle.meta.url
        returnMeta.sourceTitle = sourceArticle.meta.title
        returnMeta.targetUrl = targetArticle.meta.url
        returnMeta.targetTitle = targetArticle.meta.title
        callback(returnMeta)
    }
}

module.exports.generateRelevantScoreList = generateRelevantScoreList