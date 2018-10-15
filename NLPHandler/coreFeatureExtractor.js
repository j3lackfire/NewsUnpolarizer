/**
 * Created by Le Pham Minh Duc on 15-Oct-18.
 */
const nlpAnnotator = require('./nlpAnnotator')
const openieProcessor = require('./openieProcessor')
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
            console.log("ERROR Annotating the paragraph!!!!!!!!!!!");
            callback(error, null)
        } else {
            nerProcessor.extractNerFromNLP(nlpAnnotation, (err_2, entities) => {
                if (err_2) {
                    console.error("Error trying to get NER from the paragraph")
                    callback(err_2, null)
                } else {
                    openieProcessor.extractOpenieFromNLP(nlpAnnotation, (err_3, openie) => {
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

function _shouldSaveTriplet(triplet, entitiesArray) {
    return _getContainingEntities(_getContainingEntities(triplet, entitiesArray).length > 0)
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

function _isTripletWithinTriplet(smallerTriplet, biggerTriplet) {
    return smallerTriplet != biggerTriplet && //not the same triplet
        _isArrayWithinRange(smallerTriplet.subjectSpan, biggerTriplet.subjectSpan) && //subject
        _isArrayWithinRange(smallerTriplet.relationSpan, biggerTriplet.relationSpan) && //relation
        _isArrayWithinRange(smallerTriplet.objectSpan, biggerTriplet.objectSpan) //object
}

function _isThereBiggerTriplet(triplet, tripletList) {
    for (let i = 0; i < tripletList.length; i ++) {
        if (_isTripletWithinTriplet(triplet, tripletList[i])) {
            return true
        }
    }
    return false
}

function trimShorterTriplets(coreFeatures, callback) {
    let returnVal = []
    for (let i = 0; i < coreFeatures.length; i++) {
        let currentVal = {}
        currentVal.triplets = []
        for (let a = 0; a < coreFeatures[i].triplets.length; a ++) {
            if (!_isThereBiggerTriplet(coreFeatures[i].triplets[a], coreFeatures[i].triplets)) {
                currentVal.triplets.push(coreFeatures[i].triplets[a])
            }
        }
        returnVal.push(currentVal)
    }
    callback(returnVal)
}


module.exports.extractCoreFeatures = extractCoreFeatures
module.exports.trimShorterTriplets = trimShorterTriplets