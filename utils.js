/**
 * Created by Le Pham Minh Duc on 09-Oct-18.
 */
const util = require('util')

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

module.exports.isNullOrUndefined = isNullOrUndefined
module.exports.logFullObject = logFullObject
module.exports.isEntitySimilar = isEntitySimilar
module.exports.isEntityInList = isEntityInList
module.exports.getEntityIndexInList = getEntityIndexInList