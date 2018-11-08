/**
 * Created by Le Pham Minh Duc on 07-Nov-18.
 */
/* List of all the possible word position in sentence
 https://stackoverflow.com/questions/1833252/java-stanford-nlp-part-of-speech-labels
 CC Coordinating conjunction
 CD Cardinal number
 DT Determiner
 EX Existential there
 FW Foreign word
 IN Preposition or subordinating conjunction
 JJ Adjective
 JJR Adjective, comparative
 JJS Adjective, superlative
 LS List item marker
 MD Modal
 NN Noun, singular or mass
 NNS Noun, plural
 NNP Proper noun, singular
 NNPS Proper noun, plural
 PDT Predeterminer
 POS Possessive ending
 PRP Personal pronoun
 PRP$ Possessive pronoun
 RB Adverb
 RBR Adverb, comparative
 RBS Adverb, superlative
 RP Particle
 SYM Symbol
 TO to
 UH Interjection
 VB Verb, base form
 VBD Verb, past tense
 VBG Verb, gerund or present participle
 VBN Verb, past participle
 VBP Verb, non­3rd person singular present
 VBZ Verb, 3rd person singular present
 WDT Wh­determiner
 WP Wh­pronoun
 WP$ Possessive wh­pronoun
 WRB Wh­adverb */

function filterOpenieResult(openieResult, callback) {
    let returnList = []
    for (let i = 0; i < openieResult.length; i ++) {
        let currentOpenie = openieResult[i]
        let tokenList = currentOpenie.tokens
        for (let j = 0; j < currentOpenie.triplets.length; j ++) {
            let currentTriplet = currentOpenie.triplets[j]
            if (_isTripletMeaningful(currentTriplet, tokenList)) {
                console.log(currentTriplet.full + " - is GOOD")
            } else {
                console.log(currentTriplet.full + " - NOT MEANING FUL LULULULULUL")
            }
        }
    }
}

function _isTripletMeaningful(_triplet, _tokensList) {
    return _isRelationMeaningful(_triplet.relationSpan, _tokensList)
}

function _isSubjectMeaningful(_subject) {
    return false
}

function _isRelationMeaningful(_relationSpan, _tokenList) {
    let relationTokensIndex = _getIndexFromSpan(_relationSpan)
    let relationTokens = []
    for (let i = 0; i < relationTokensIndex.length; i ++) {
        let currentToken = _tokenList[relationTokensIndex[i]]
        relationTokens.push(currentToken)
        if (currentToken.pos.includes("VB")) {
            return true
        }
    }
    return false
}

function _isObjectMeaningful(_object) {
    return false
}

// a list of [22, 25] is expected to return 22, 23, 24 and 25
// the displaying INDEX in their json response start from 1, so this will be 1 off
// but because we only use this value to get from their return array, which start from 0,
// this works and look less messy
function _getIndexFromSpan(_spanList) {
    let returnList = []
    for (let i = _spanList[0]; i < _spanList[1]; i ++) {
        returnList.push(i)
    }
    return returnList
}

module.exports.filterOpenieResult = filterOpenieResult