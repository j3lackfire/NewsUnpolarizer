/**
 * Created by Le Pham Minh Duc on 10-Oct-18.
 */
const utils = require('./../utils')
const nlpAnnotator = require('./nlpAnnotator')
const nerProcessor = require('./nerProcessor')

function extractCoreFeature(paragraph, callback) {
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
                        // if (_shouldSaveTriple(openie[i].triplets[j], ner[i].entities)) {
                        //     currentSentence.triplets.push(openie[i].triplets[j])
                        // }
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
    nlpAnnotator.requestNlpAnnotation(paragraph, (error, response, body) => {
        if (error) {
            console.log("ERROR Annotating the paragraph!!!!!!!!!!!");
            callback(error, null)
        } else {
            if (response.statusCode != 200) {
                callback({'statusCode':statusCode}, null)
            } else {
                nerProcessor.extractNerFromNLP(body.sentences, (err_2, entities) => {
                    if (err_2) {
                        console.error("Error trying to get NER from the paragraph")
                        callback(err_2, null)
                    } else {
                        extractOpenieFromNLP(body.sentences, (err_3, openie) => {
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
        }
    })
}

function analyzeOpenIeFromParagraph(paragraph, callback) {
    nlpAnnotator.requestNlpAnnotation(paragraph, (error, response, body) => {
        if (error) {
            console.log("ERROR Annotating the paragraph!!!!!!!!!!!");
            callback(error, null)
        } else {
            if (response.statusCode != 200) {
                callback({'statusCode':statusCode}, null)
            } else {
                extractOpenieFromNLP(body.sentences, callback)
            }
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

function _isArrayWithinRange(smallerArray, biggerArray) {
    return (smallerArray[0] >= biggerArray[0]) && (smallerArray[1] <= biggerArray[1])
}

function _shouldSaveTriple(triplet, entitiesArray) {
    for (let i = 0; i < entitiesArray.length; i ++) {
        let entitySpan =  entitiesArray[i].span
        if (_isArrayWithinRange(entitySpan, triplet.subjectSpan) ||
            _isArrayWithinRange(entitySpan, triplet.relationSpan) ||
            _isArrayWithinRange(entitySpan, triplet.objectSpan))
            return true
    }
    return false
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

p = "In the Senate race, one of the most unexpectedly tight in the nation, any small shift among evangelical voters - long a stable base for Republicans - could be a significant loss for Mr. Cruz, who, like President Trump, has made white evangelicals the bulwark of his support. To Democrats nationwide, who have largely written off white evangelical voters, it also sends a signal - not just for the midterms but also for the 2020 presidential campaign - that there are female, religious voters who are open to some of their party's candidates. One in three Texans are evangelical, according to the Pew Research Center, and 85 percent of white evangelical voters in Texas supported Mr. Trump in 2016, higher than even the national average, which was a record high for a presidential election. The New York Times's Upshot section has been polling the race, and most public opinion polls show Mr. Cruz holding a small lead.Still, Ms. Mooney and her friends may represent an under-the-radar web of white, evangelical women in Texas whose vote in November may be more up for grabs than at any time in the recent past. The church in Texas is becoming a testing ground for the future of the evangelical voice in politics, and for evangelicals who oppose the new religious right's momentum. In Texas, since the 2016 election, black worshipers have been leaving white churches, and some white evangelical women have tiptoed away from Mr. Trump. Spending money to win over evangelical voters is not as much of a priority as trying to turn out people who voted for Ms. Clinton, says Jason Stanford, a former longtime Democrat strategist in Texas."

extractCoreFeature(p, (err, result) => {
    for (let i = 0; i < result.length; i ++) {
        for (let j = 0; j < result[i].triplets.length; j ++) {
            console.log(result[i].triplets[j].full)
        }
    }
    // utils.logFullObject(result)
})

