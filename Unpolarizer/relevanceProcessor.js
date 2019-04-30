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
    getRelevantScore(sourceArticle, articleList[index], (relevanceMeta) => {
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
function getRelevantScore(sourceArticle, targetArticle, callback) {
    if (sourceArticle.meta.url === targetArticle.meta.url) {
        callback(null)
        return
    }
    //some weird comparision function here, including ner in subject/object
    let returnObject = {}
    returnObject.meta = {}
    returnObject.meta.sourceUrl = sourceArticle.meta.url
    returnObject.meta.sourceTitle = sourceArticle.meta.title
    returnObject.meta.targetUrl = targetArticle.meta.url
    returnObject.meta.targetTitle = targetArticle.meta.title
    returnObject.meta.relatedTriplesCount = 0
    // returnObject.meta.oppositeTriplesCount = 0
    returnObject.meta.relatedSentencesCount = 0
    returnObject.relatedSentences = []
    // returnObject.oppositeTriples = []

    for (let i = 0; i < sourceArticle.data.length; i ++) {
        for (let j = 0; j < targetArticle.data.length; j ++) {

            let sentence = {}
            sentence.sourceIndex = i
            sentence.targetIndex = j
            sentence.sourceSentence = sourceArticle.data[i].text
            sentence.targetSentence = targetArticle.data[j].text
            sentence.triples = []

            for (let a = 0; a < sourceArticle.data[i].triplets.length; a ++) {
                for (let b = 0; b < targetArticle.data[j].triplets.length; b ++) {
                    let triple_1 = sourceArticle.data[i].triplets[a]
                    let triple_2 = targetArticle.data[j].triplets[b]
                    let triplesComparision = _getTriplesComparisionObject(triple_1, triple_2)
                    if (triplesComparision  != null) {
                        sentence.triples.push(triplesComparision)
                        returnObject.meta.relatedTriplesCount ++
                    }
                }
            }

            if (sentence.triples.length > 0) {
                returnObject.meta.relatedSentencesCount ++
                returnObject.relatedSentences.push(sentence)
            }
        }
    }

    callback(returnObject)
}

function _getTriplesComparisionObject(triple_1, triple_2) {
    let returnObject = {}
    returnObject.sourceStatement = triple_1.full
    returnObject.targetStatement = triple_2.full
    let commonEntity = []
    for (let i = 0; i < triple_1.entities.length; i ++) {
        for (let j = 0; j < triple_2.entities.length; j++) {
            if (utils.isEntitySimilar(triple_1.entities[i], triple_2.entities[j])) {
                commonEntity.push(triple_1.entities[i])
            }
        }
    }
    if (commonEntity.length > 0) {
        // let verbComparision = _getVerbsComparision(triple_1.relationVerb, triple_1.verbSynonym, triple_1.verbAntonym, triple_2.relationVerb)
        let verbComparision_1 = _getVerbsComparision(triple_1.relationVerb, triple_1.verbSynonym, triple_1.verbAntonym, triple_2.relationVerb)
        let verbComparision_2 = _getVerbsComparision(triple_2.relationVerb, triple_2.verbSynonym, triple_2.verbAntonym, triple_1.relationVerb)
        let verbComparision = verbComparision_1 == verbComparision_2 ? verbComparision_1 : 0
        if (verbComparision == 1)
        returnObject.entities = commonEntity
        if (verbComparision != 0) {
            returnObject.sourceVerb = triple_1.relationVerb
            returnObject.targetVerb = triple_2.relationVerb
            return returnObject
        } else {
            if (commonEntity.length == 1) {
                return null
            } else {
                return returnObject
            }
        }

    } else {
        return null
    }
}


//1 is similar word, -1 is un-related word, 0 is not related word
function _getVerbsComparision(verb_1, verb_1_synonym, verb_1_antonym, verb_2) {
    if (verb_1 == verb_2 || verb_1_synonym.includes(verb_2)) {
        return 1
    } else {
        if (verb_1_antonym.includes(verb_2)) {
            return -1
        } else {
            return 0
        }
    }
}

function getSortedRelevanceList(relevantMetaList) {
    return relevantMetaList.sort((a, b) => b.meta.relatedSentencesCount - a.meta.relatedSentencesCount)
}

module.exports.generateRelevantScoreList = generateRelevantScoreList
module.exports.getSortedRelevanceList = getSortedRelevanceList

module.exports.getRelevantScore = getRelevantScore