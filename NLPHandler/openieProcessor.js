/**
 * Created by Le Pham Minh Duc on 10-Oct-18.
 */
const nlpAnnotator = require('./nlpAnnotator')
const nerProcessor = require('./nerProcessor')

function extractOpenIeFromParagraph(paragraph, callback) {
    nlpAnnotator.requestNlpAnnotation(paragraph, (error, nlpAnnotation) => {
        if (error) {
            console.log("ERROR requesting the nlp annotation!");
            callback(error, null)
        } else {
            extractOpenieFromNLP(nlpAnnotation, callback)
        }
    })
}

function extractOpenieFromNLP(nlpAnnotation, callback) {
    let returnVal = []
    let sentencesCount = nlpAnnotation.length;
    for (let i= 0; i < sentencesCount; i ++) {
        let currentSentence = {}
        let currentResult = nlpAnnotation[i]
        currentSentence.triplets = []
        for (let j = 0; j < currentResult.openie.length; j ++) {
            let triplet = currentResult.openie[j]
            let returnTriplet = {}
            returnTriplet.subject = triplet.subject
            returnTriplet.relation = triplet.relation
            returnTriplet.object = triplet.object

            returnTriplet.subjectSpan = triplet.subjectSpan
            returnTriplet.relationSpan = triplet.relationSpan
            returnTriplet.objectSpan = triplet.objectSpan
            returnTriplet.full = returnTriplet.subject + " " + returnTriplet.relation + " " + returnTriplet.object
            currentSentence.triplets.push(returnTriplet)
        }
        returnVal.push(currentSentence)
    }
    callback(null, returnVal)
}


module.exports.extractOpenIeFromParagraph = extractOpenIeFromParagraph
module.exports.extractOpenieFromNLP = extractOpenieFromNLP