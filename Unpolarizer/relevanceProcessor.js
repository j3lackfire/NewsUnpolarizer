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
        returnMeta.header = {}
        returnMeta.header.sourceUrl = sourceArticle.meta.url
        returnMeta.header.sourceTitle = sourceArticle.meta.title
        returnMeta.header.targetUrl = targetArticle.meta.url
        returnMeta.header.targetTitle = targetArticle.meta.title
        returnMeta.entities = []
        for (let i = 0; i < sourceArticle.entities.length; i ++) {
            for (let j = 0; j < targetArticle.entities.length; j ++) {
                //TODO extra work with the adding because there's a lot of duplicated result
                if (utils.isEntitySimilar(sourceArticle.entities[i], targetArticle.entities[j])) {
                    returnMeta.entities.push(sourceArticle.entities[i])
                    utils.logFullObject(targetArticle.entities[j])
                }
            }
        }
        callback(returnMeta)
    }
}

module.exports.generateRelevantScoreList = generateRelevantScoreList