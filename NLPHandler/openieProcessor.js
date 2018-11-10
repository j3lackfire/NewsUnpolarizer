/**
 * Created by Le Pham Minh Duc on 10-Oct-18.
 */
const nlpAnnotator = require('./nlpAnnotator')
const tripletProcessor = require('./tripletProcessor')
const nerProcessor = require('./nerProcessor')

function extractRawOpenIeFromParagraph(paragraph, callback) {
    nlpAnnotator.requestNlpAnnotation(paragraph, (error, nlpAnnotation) => {
        if (error) {
            console.log("ERROR requesting the nlp annotation!");
            callback(error, null)
        } else {
            extractRawOpenieFromNLP(nlpAnnotation, callback)
        }
    })
}

function extractRawOpenieFromNLP(nlpAnnotation, callback) {
    let returnVal = []
    let sentencesCount = nlpAnnotation.length;
    for (let i= 0; i < sentencesCount; i ++) {
        let currentSentence = {}
        let currentResult = nlpAnnotation[i]
        currentSentence.triplets = []
        currentSentence.tokens = []
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
        for (let j = 0; j < currentResult.tokens.length; j ++) {
            let token = currentResult.tokens[j]
            let returnToken = {}

            returnToken.index = token.index
            returnToken.word = token.word
            returnToken.lemma = token.lemma
            returnToken.pos = token.pos
            currentSentence.tokens.push(returnToken)
        }
        returnVal.push(currentSentence)
    }
    callback(null, returnVal)
}

function extractFilteredOpenIeFromParagraph(paragraph, callback) {
    extractRawOpenIeFromParagraph(paragraph, (err, openie) => {
        if (err) {
            console.error("ERROR extracting openie from paragraph!");
            callback(error, null)
        } else {
            tripletProcessor.filterOpenieResult(openie, (result) => {
                callback(null, result)
            })
        }
    })
}

function extractFilteredOpenIeFromNLP(nlpAnnotation, callback) {
    extractRawOpenieFromNLP(nlpAnnotation, (err, openie) => {
        if (err) {
            console.error("ERROR extracting openie from paragraph!");
            callback(error, null)
        } else {
            tripletProcessor.filterOpenieResult(openie, (result) => {
                callback(null, result)
            })
        }
    })
}

module.exports.extractRawOpenIeFromParagraph = extractRawOpenIeFromParagraph
module.exports.extractRawOpenieFromNLP = extractRawOpenieFromNLP
module.exports.extractFilteredhOpenIeFromParagraph = extractFilteredOpenIeFromParagraph
module.exports.extractFilteredOpenIeFromNLP = extractFilteredOpenIeFromNLP