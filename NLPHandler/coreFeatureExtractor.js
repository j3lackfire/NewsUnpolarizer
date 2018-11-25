/**
 * Created by Le Pham Minh Duc on 15-Oct-18.
 */
const utils = require('./../utils')
const nlpAnnotator = require('./nlpAnnotator')
const openieProcessor = require('./openieProcessor')
const summarizer = require('./../NewsGatherer/summarizer')
const tripletProcessor = require('./tripletMeaningfulProcessor')
const nerProcessor = require('./nerProcessor')

function extractCoreFeaturesAndMetaFromUrl(url, callback) {
    summarizer.summaryUrl(url, (err, summaryResponse) => {
        if (err) {
            console.error(err)
            console.error("error while trying to get paragraph from summarizer")
            callback(err, null)
        } else {
            let savedData = {}
            savedData.meta = {}
            savedData.meta.url = url
            savedData.meta.title = summaryResponse.sm_api_title
            console.log(summaryResponse.sm_api_content)
            extractCoreFeaturesFromParagraph(summaryResponse.sm_api_content, (err_2, res_2) => {
                if (err_2) {
                    console.error(err_2)
                    console.error("Error annotating the article")
                    callback(err, null)
                } else {
                    savedData.data = res_2
                    callback(null, savedData)
                }
            })
        }
    })
}

function extractCoreFeaturesFromParagraph(paragraph, callback) {
    extractNerAndOpenieFromParagraph(paragraph, (err, ner, openie) => {
        if (err) {
            callback(err, null)
        } else {
            if (ner.length != openie.length) {
                console.error("The length of open ie and ner is different. Please check!!!")
                callback("Invalid NER and OpenIE result!!!", null)
            } else {
                let returnVal = []
                for (let i = 0; i < openie.length; i ++) {
                    let currentSentence = {}
                    currentSentence.text = openie[i].text
                    currentSentence.triplets = []
                    for (let j = 0; j < openie[i].triplets.length; j ++) {
                        let containingEntities = _getContainingEntities(openie[i].triplets[j], ner[i].entities)
                        if (containingEntities.length > 0) {
                            let savedTriplet = {}
                            savedTriplet.subject = openie[i].triplets[j].subject
                            savedTriplet.relation = openie[i].triplets[j].relation
                            savedTriplet.object = openie[i].triplets[j].object
                            savedTriplet.relationVerb = openie[i].triplets[j].relationVerb
                            savedTriplet.full = openie[i].triplets[j].full
                            savedTriplet.entities = containingEntities
                            currentSentence.triplets.push(savedTriplet)
                        }
                    }
                    returnVal.push(currentSentence)
                }
                callback(null, returnVal)
            }
        }
    })
}

function extractNerAndOpenieFromParagraph(paragraph, callback) {
    nlpAnnotator.requestNlpAnnotation(paragraph, (error, nlpAnnotation) => {
        if (error) {
            console.error("ERROR requesting nlp annotator");
            callback(error, null)
        } else {
            nerProcessor.extractNerFromNLP(nlpAnnotation, (err_2, entities) => {
                if (err_2) {
                    console.error("Error trying to get NER from the paragraph")
                    callback(err_2, null)
                } else {
                    openieProcessor.extractFilteredOpenIeFromNLP(nlpAnnotation, (err_3, openie) => {
                        if (err_3) {
                            console.error("Error trying to get OPEN IE from the paragraph")
                            callback(err_3, null)
                        } else{
                            callback(null, entities, openie)
                        }
                    })
                }
            })
        }
    })
}

function _getContainingEntities(triplet, entitiesArray) {
    let returnEntitiesList = []
    for (let i = 0; i < entitiesArray.length; i ++) {
        let entity = entitiesArray[i]
        if (triplet.subject.includes(entity.text) || triplet.object.includes(entity.text)) {
            let returnEntity = {}
            returnEntity.text = entity.text
            returnEntity.ner = entity.ner
            returnEntity.positionText = triplet.subject.includes(entity.text) ? "subject" : "object"
            if (!_isEntityAlreadySaved(returnEntity, returnEntitiesList)) {
                returnEntitiesList.push(returnEntity)
            }
        }
    }
    return returnEntitiesList
}

function _isEntityAlreadySaved(entity, entityList) {
    for (let i = 0; i < entityList.length; i ++) {
        if (entityList[i].text == entity.text
            && entityList[i].ner == entity.ner
            && entityList[i].positionText == entity.positionText) {
            return true
        }
    }
    return false
}

module.exports.extractCoreFeaturesFromParagraph = extractCoreFeaturesFromParagraph
module.exports.extractCoreFeaturesAndMetaFromUrl = extractCoreFeaturesAndMetaFromUrl

