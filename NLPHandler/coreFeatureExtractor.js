/**
 * Created by Le Pham Minh Duc on 15-Oct-18.
 */
const utils = require('./../utils')
const nlpAnnotator = require('./nlpAnnotator')
const openieProcessor = require('./openieProcessor')
const tripletProcessor = require('./tripletMeaningfulProcessor')
const nerProcessor = require('./nerProcessor')

function extractCoreFeatures(paragraph, callback) {
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
                    currentSentence.triplets = []
                    for (let j = 0; j < openie[i].triplets.length; j ++) {
                        let containingEntities = _getContainingEntities(openie[i].triplets[j], ner[i].entities)
                        if (containingEntities.length > 0) {
                            let savedTriplet = openie[i].triplets[j]
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
    let returnVal = []
    for (let i = 0; i < entitiesArray.length; i ++) {
        let entitySpan =  entitiesArray[i].span
        if (_isArrayWithinRange(entitySpan, triplet.subjectSpan) ||
            // _isArrayWithinRange(entitySpan, triplet.relationSpan) ||
            _isArrayWithinRange(entitySpan, triplet.objectSpan))
            returnVal.push(entitiesArray[i])
    }
    return returnVal
}

function _isArrayWithinRange(smallerArray, biggerArray) {
    return (smallerArray[0] >= biggerArray[0]) && (smallerArray[1] <= biggerArray[1])
}

module.exports.extractCoreFeatures = extractCoreFeatures