/**
 * Created by Le Pham Minh Duc on 10-Oct-18.
 */
const utils = require('./../utils')
const nlpAnnotator = require('./nlpAnnotator')
const tripletMeaningfulProcessor = require('./tripletMeaningfulProcessor')
const tripletTrimmer = require('./tripletTrimmer')
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
            // returnTriplet.subjectSpan = triplet.subjectSpan
            // returnTriplet.relationSpan = triplet.relationSpan
            // returnTriplet.objectSpan = triplet.objectSpan
            returnTriplet.full = triplet.subject + " " + triplet.relation + " " + triplet.object
            currentSentence.triplets.push(returnTriplet)
        }
        let filteredTokenList = _filterTokenList(currentResult.tokens)
        for (let j = 0; j < filteredTokenList.length; j ++) {
            let token = filteredTokenList[j]
            let returnToken = {}

            returnToken.index = j
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
            utils.logFullObject(openie)
            tripletMeaningfulProcessor.filterOpenieResult(openie, (result) => {
                tripletTrimmer.trimShorterTriplets(result, (trimmedTriplets) => {
                    callback(null, trimmedTriplets)
                })
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
            tripletMeaningfulProcessor.filterOpenieResult(openie, (result) => {
                tripletTrimmer.trimShorterTriplets(result, (trimmedTriplets) => {
                    callback(null, trimmedTriplets)
                })
            })
        }
    })
}

function _filterTokenList(tokenList) {
    let filteredList = []
    for (let i = 0; i < tokenList.length; i ++) {
        if (tokenList[i].pos != '``' && tokenList[i].pos != '\'\'' && tokenList[i].word != '\\') {
            filteredList.push(tokenList[i])
        }
    }
    return filteredList
}

module.exports.extractRawOpenIeFromParagraph = extractRawOpenIeFromParagraph
module.exports.extractRawOpenieFromNLP = extractRawOpenieFromNLP
module.exports.extractFilteredOpenIeFromParagraph = extractFilteredOpenIeFromParagraph
module.exports.extractFilteredOpenIeFromNLP = extractFilteredOpenIeFromNLP