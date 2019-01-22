/**
 * Created by Le Pham Minh Duc on 25-Nov-18.
 */
const utils = require('./../utils')
const entityPairProcessor = require('./entityPairsProcessor')

//Generate the list of relevant score between one article and all the one in the db
function generateRelevantScoreList(sourceArticle, articleList, callback) {
    _recursiveGetRelevantScore(0, sourceArticle, articleList, [], (relevantMetaList) => {
        callback(getSortedRelevanceList(relevantMetaList))
    })
}

//Recursively call the function below to generate a list of all articles and its score
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

//Get the relevant score between two articles
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
        returnObject.meta.entityPairCount = 0
        returnObject.meta.commonEntityCount = 0
        returnObject.meta.commonStatementCount = 0
        returnObject.entitiesPair = []
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
            //To display the sentences for the user, we would want to display a sentence once even if it appear many times.
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
        // The entity Pair is process in here!
        returnObject.entitiesPair = entityPairProcessor.getCommonEntityPair(returnObject)
        if (!utils.isNullOrUndefined(returnObject.entitiesPair)) {
            returnObject.meta.entityPairCount = returnObject.entitiesPair.length
            for (let i = 0; i < returnObject.entitiesPair.length; i ++) {
                let cacheObject = returnObject.entitiesPair[i]
                cacheObject.sourceStatement = sourceArticle.data[cacheObject.sourceSentenceIndex].triplets[cacheObject.sourceTripletIndex].full
                cacheObject.targetStatement = targetArticle.data[cacheObject.targetSentenceIndex].triplets[cacheObject.targetTripletIndex].full
            }
        }
        callback(returnObject)
    }
}

function _getCrossoverList(firstSentenceIndex, firstTripletIndex, secondSentenceIndex, secondTripletIndex) {
    let returnList = []
    for (let i = 0; i < firstSentenceIndex.length; i ++) {
        for (let j = 0; j < secondSentenceIndex.length; j ++) {
            if (firstSentenceIndex[i] == secondSentenceIndex[j]
            && firstTripletIndex[i] == secondTripletIndex[j]) {
                let myObject = {}
                myObject.sentenceIndex = firstSentenceIndex[i]
                myObject.tripletIndex = firstTripletIndex[i]
                returnList.push(myObject)
            }
        }
    }
    return returnList
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

function getSortedRelevanceList(relevantMetaList) {
    return relevantMetaList.sort((a, b) => {
        let aScore = a.meta.entityPairCount * 500 + a.meta.commonEntityCount * 100 + a.meta.commonStatementCount
        let bScore = b.meta.entityPairCount * 500 + b.meta.commonEntityCount * 100 + b.meta.commonStatementCount
        return bScore - aScore
    })
}

module.exports.generateRelevantScoreList = generateRelevantScoreList
module.exports.getSortedRelevanceList = getSortedRelevanceList