/**
 * Created by Le Pham Minh Duc on 09-Oct-18.
 */
const util = require('util')
const dbReader = require('./LocalDB/dbReader')

function isNullOrUndefined(val) {
    return (typeof(val) == "undefined" || val == null || val == "" || val.length == 0)
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

function logShortenRelevanceProcessorResult(result) {
    let returnVal = []
    for (let i = 0; i < result.length; i ++) {
        let newVal = {}
        newVal.meta = result[i].meta
        newVal.entitiesPair = result[i].entitiesPair
        newVal.entities = []
        for (let j = 0; j <  result[i].entities.length; j ++) {
            let entityToAdd = {}
            entityToAdd.text = result[i].entities[j].text
            entityToAdd.ner = result[i].entities[j].ner
            entityToAdd.positionText = result[i].entities[j].positionText
            entityToAdd.timesAppear = result[i].entities[j].sourceSentenceIndex.length + result[i].entities[j].targetSentenceIndex.length
            newVal.entities.push(entityToAdd)
        }
        returnVal.push(newVal)
    }
    logFullObject(returnVal)
    return returnVal
}

function copyEntity(entity) {
    let returnObject = {}
    returnObject.text = entity.text
    returnObject.ner = entity.ner
    returnObject.positionText = entity.positionText
    return returnObject
}

module.exports.isNullOrUndefined = isNullOrUndefined
module.exports.logFullObject = logFullObject
module.exports.isEntitySimilar = isEntitySimilar
module.exports.isEntityInList = isEntityInList
module.exports.getEntityIndexInList = getEntityIndexInList
module.exports.getAllUrlsInDb = getAllUrlsInDb
module.exports.logShortenRelevanceProcessorResult = logShortenRelevanceProcessorResult
module.exports.copyEntity = copyEntity