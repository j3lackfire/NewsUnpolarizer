/**
 * Created by Le Pham Minh Duc on 20-Dec-18.
 */
const utils = require('./../utils')
//This is to find a pair of entities that appear in the same triplet
//Is: Russia is attacking Ukraine
//-> Should return russia (subject/country) and Ukraine (object/country)

/*
    Doing like above would require sooo much un-necessary refactoring, which I really don't want to do now
    Just use the data from the relevance processor data and then find the pairs
    I guess it might be a bit more messier but won't be as much of a problem.
*/
function getCommonEntityPair(relevantData, callback) {
    //Loop through the data to find entity paris
    //And then match the entities pair from the source article and target article
    let sourceEntityList = []
    let targetEntityList = []
    for (let i = 0; i < relevantData.entities.length; i ++) {
        let currentEntity = relevantData.entities[i]
        let sourceEntity = {}
        sourceEntity.text = currentEntity.text
        sourceEntity.ner = currentEntity.ner
        sourceEntity.positionText = currentEntity.positionText
        sourceEntity.sentenceIndex = currentEntity.sourceSentenceIndex
        sourceEntity.tripletIndex = currentEntity.sourceTripletIndex
        sourceEntityList.push(sourceEntity)

        let targetEntity = {}
        targetEntity.text = currentEntity.text
        targetEntity.ner = currentEntity.ner
        targetEntity.positionText = currentEntity.positionText
        targetEntity.sentenceIndex = currentEntity.targetSentenceIndex
        targetEntity.tripletIndex = currentEntity.targetTripletIndex
        targetEntityList.push(targetEntity)
    }
    let sourceEntitiesPair = _getCommonEntityPairs(sourceEntityList)
    let targetEntitiesPair = _getCommonEntityPairs(targetEntityList)
    let commonEntityPairList = []
    if (utils.isNullOrUndefined(sourceEntitiesPair) || utils.isNullOrUndefined(targetEntitiesPair)) {
        callback(null)
        return
    }
    for (let i = 0; i < sourceEntitiesPair.length; i ++) {
        for (let j = 0; j < targetEntitiesPair.length; j ++) {
            let entitySource = sourceEntitiesPair[i]
            let entityTarget = targetEntitiesPair[j]
            if ((utils.isEntitySimilar(entitySource.entity_1, entityTarget.entity_1)
            && utils.isEntitySimilar(entitySource.entity_2, entityTarget.entity_2))
            || (utils.isEntitySimilar(entitySource.entity_1, entityTarget.entity_2)
            && utils.isEntitySimilar(entitySource.entity_2, entityTarget.entity_1))) {
                let returnObject = {}
                returnObject.entity_1 = utils.copyEntity(entitySource.entity_1)
                returnObject.entity_2 = utils.copyEntity(entitySource.entity_2)
                returnObject.sourceSentenceIndex = entitySource.sentenceIndex
                returnObject.sourceTripletIndex = entitySource.tripletIndex
                returnObject.targetSentenceIndex = entityTarget.sentenceIndex
                returnObject.targetTripletIndex = entityTarget.tripletIndex
                commonEntityPairList.push(returnObject)
            }
        }
    }
    callback(commonEntityPairList)
}

function _getCommonEntityPairs(entityList) {
    if (entityList.length <= 1) {
        return null
    } else {
        let commonEntityPairs = []
        for (let i = 0; i < entityList.length - 1; i ++) {
            for (let j = i + 1; j < entityList.length; j ++) {
                let entityPairs = _findEntityPairAppearance(entityList[i], entityList[j])
                if (entityPairs == null || entityPairs == undefined || entityPairs.length == 0) {
                    //do nothing
                } else {
                    commonEntityPairs = commonEntityPairs.concat(entityPairs)
                }
            }
        }
        return commonEntityPairs
    }
}

function _findEntityPairAppearance(entity_1, entity_2) {
    let returnList = []
    for (let i = 0; i < entity_1.sentenceIndex.length; i ++) {
        for (let j = 0; j < entity_2.sentenceIndex.length; j ++) {
            if ((entity_1.sentenceIndex[i] == entity_2.sentenceIndex[j])
                && (entity_1.tripletIndex[i] == entity_2.tripletIndex[j])
                &&(entity_1.positionText != entity_2.positionText)) {
                let returnObject = {}
                returnObject.entity_1 = utils.copyEntity(entity_1)
                returnObject.entity_2 = utils.copyEntity(entity_2)
                returnObject.sentenceIndex = entity_1.sentenceIndex[i]
                returnObject.tripletIndex = entity_1.tripletIndex[i]
                returnList.push(returnObject)
            }
        }
    }
    return returnList
}

module.exports.getCommonEntityPair = getCommonEntityPair