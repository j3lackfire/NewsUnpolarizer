/**
 * Created by Le Pham Minh Duc on 09-Oct-18.
 */
const util = require('util')
const dbReader = require('./LocalDB/dbReader')

function isNullOrUndefined(val) {
    return (typeof(val) == "undefined" || val == null || val == "")
}

function logFullObject(obj) {
    console.log(util.inspect(obj, false, null, true))
}

function isEntitySimilar(sourceEntity, targetEntity) {
    return (sourceEntity.text == targetEntity.text &&
        sourceEntity.ner == targetEntity.ner &&
        sourceEntity.positionText == targetEntity.positionText)
}

function isEntityInList(entity, entitiesList) {
    for (let i = 0; i < entitiesList.length; i ++) {
        if (isEntitySimilar(entity, entitiesList[i])) {
            return true
        }
    }
    return false
}

function getEntityIndexInList(entity, entitiesList) {
    for (let i = 0; i < entitiesList.length; i ++) {
        if (isEntitySimilar(entity, entitiesList[i])) {
            return i
        }
    }
    return -1
}

function getAllUrlsInDb(callback) {
    dbReader.readDbAsJson((err, annotatedArticles) => {
        if (err) {
            console.error("Can't read db")
            callback(null)
        } else {
            let dbUrls = []

            for (let i = 0; i < annotatedArticles.length; i ++) {
                dbUrls.push(annotatedArticles[i].meta.url)
            }
            callback(dbUrls)
        }
    })
}

module.exports.isNullOrUndefined = isNullOrUndefined
module.exports.logFullObject = logFullObject
module.exports.isEntitySimilar = isEntitySimilar
module.exports.isEntityInList = isEntityInList
module.exports.getEntityIndexInList = getEntityIndexInList
module.exports.getAllUrlsInDb = getAllUrlsInDb