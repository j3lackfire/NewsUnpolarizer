/**
 * Created by Le Pham Minh Duc on 25-Nov-18.
 */
const utils = require('./../utils')

function generateRelevantScoreList(sourceArticle, articleList, callback) {
    _recursiveGetRelevantScore(0, sourceArticle, articleList, [], (relevantMetaList) => {
        relevantMetaList.sort((a, b) => {
            return b.meta.commonEntityCount - a.meta.commonStatementCount
            // if (b.meta.commonEntityCount == a.meta.commonStatementCount) {
            //     return b.meta.commonStatementCount - a.meta.commonStatementCount
            // } else {
            //     return b.meta.commonEntityCount - a.meta.commonStatementCount
            // }
        })
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
        let returnObject = {}
        returnObject.meta = {}
        returnObject.meta.sourceUrl = sourceArticle.meta.url
        returnObject.meta.sourceTitle = sourceArticle.meta.title
        returnObject.meta.targetUrl = targetArticle.meta.url
        returnObject.meta.targetTitle = targetArticle.meta.title
        returnObject.meta.tripletPairCount = 0
        returnObject.meta.commonEntityCount = 0
        returnObject.meta.commonStatementCount = 0
        returnObject.entities = []
        for (let i = 0; i < sourceArticle.entities.length; i ++) {
            for (let j = 0; j < targetArticle.entities.length; j ++) {
                if (utils.isEntitySimilar(sourceArticle.entities[i], targetArticle.entities[j])) {
                    let sourceEntity = sourceArticle.entities[i]
                    let targetEntity = targetArticle.entities[j]
                    let entityToAdd = {}
                    let entityIndexInList = utils.getEntityIndexInList(sourceEntity, returnObject.entities)
                    // Entity is not exist in the list, create new
                    if (entityIndexInList == -1) {
                        entityToAdd.text = sourceEntity.text
                        entityToAdd.ner = sourceEntity.ner
                        entityToAdd.positionText = sourceEntity.positionText

                        entityToAdd.sourceSentenceIndex = [sourceEntity.sentenceIndex]
                        entityToAdd.sourceTripletIndex = [sourceEntity.tripletIndex]
                        entityToAdd.targetSentenceIndex = [targetEntity.sentenceIndex]
                        entityToAdd.targetTripletIndex = [targetEntity.tripletIndex]

                        entityToAdd.sourceStatement = [sourceArticle.data[sourceEntity.sentenceIndex].triplets[sourceEntity.tripletIndex].full]
                        entityToAdd.targetStatement = [targetArticle.data[targetEntity.sentenceIndex].triplets[targetEntity.tripletIndex].full]
                        entityToAdd.sourceSentences = []
                        entityToAdd.targetSentences = []
                        returnObject.entities.push(entityToAdd)
                    } else {
                        entityToAdd = returnObject.entities[entityIndexInList]
                        let isSourceEntityAdded = (entityToAdd.sourceSentenceIndex.includes(sourceEntity.sentenceIndex) && entityToAdd.sourceTripletIndex.includes(sourceEntity.tripletIndex))
                        let isTargetEntityAdded = (entityToAdd.targetSentenceIndex.includes(targetEntity.sentenceIndex) && entityToAdd.targetTripletIndex.includes(targetEntity.tripletIndex))
                        if (isSourceEntityAdded && !isTargetEntityAdded) {
                            //add the target entity
                            entityToAdd.targetSentenceIndex.push(targetEntity.sentenceIndex)
                            entityToAdd.targetTripletIndex.push(targetEntity.tripletIndex)
                            entityToAdd.targetStatement.push(targetArticle.data[targetEntity.sentenceIndex].triplets[targetEntity.tripletIndex].full)
                        } else {
                            if (!isSourceEntityAdded && isTargetEntityAdded) {
                                //add the source entity
                                entityToAdd.sourceSentenceIndex.push(sourceEntity.sentenceIndex)
                                entityToAdd.sourceTripletIndex.push(sourceEntity.tripletIndex)
                                entityToAdd.sourceStatement.push(sourceArticle.data[sourceEntity.sentenceIndex].triplets[sourceEntity.tripletIndex].full)
                            }
                            //else case of the entity has been already added to both the source and target
                        }
                    }
                }
            }
        }
        for (let i = 0; i < returnObject.entities.length; i ++) {
            returnObject.meta.commonStatementCount += returnObject.entities[i].sourceSentenceIndex.length + returnObject.entities[i].targetSentenceIndex.length
            let uniqueSourceSentencesIndex = _getUniqueNumberInList(returnObject.entities[i].sourceSentenceIndex)
            let uniqueTargetSentencesIndex = _getUniqueNumberInList(returnObject.entities[i].targetSentenceIndex)
            for (let j = 0; j < uniqueSourceSentencesIndex.length; j ++) {
                returnObject.entities[i].sourceSentences.push(sourceArticle.data[uniqueSourceSentencesIndex[j]].text)
            }
            for (let j = 0; j < uniqueTargetSentencesIndex.length; j ++) {
                returnObject.entities[i].targetSentences.push(targetArticle.data[uniqueTargetSentencesIndex[j]].text)
            }
        }
        returnObject.meta.commonEntityCount = returnObject.entities.length
        callback(returnObject)
    }
}

function _getUniqueNumberInList(numberList) {
    let returnVal = []
    for (let i = 0; i < numberList.length; i ++) {
        if (!returnVal.includes(numberList[i])) {
            returnVal.push(numberList[i])
        }
    }
    return returnVal
}

module.exports.generateRelevantScoreList = generateRelevantScoreList