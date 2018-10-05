/**
 * Created by Le Pham Minh Duc on 31-Mar-18.
 */
const request = require('request');
const webReader = require('./../NewsGetter/webContentReader')

const urlBuilder = require('./urlBuilder')
const dbWriter = require('./../LocalDB/dbWriter')

console.log('Default request URL to send to core NLP');
console.log(urlBuilder.getDefaultURL());

//list about some particular entities like person, organization, city or country
let discreteNerList = [
    'PERSON',
    'LOCATION',
    'ORGANIZATION',
    'MISC',
    'CITY',
    'STATE_OR_PROVINCE',
    'COUNTRY'];

//list about abstract entities, not aim at one particular person like jobs, religion or things like that
let abstractNerList = [
    'RELIGION',
    'NATIONALITY',
    'TITLE', //Job title
    'IDEOLOGY',
    'CAUSE_OF_DEATH'] //violence, shooting ....

//these words are recognized by the algorithm under the PERSON category
//but we should not record them since they are just general word
let ignoreTextList = [
    'She', 'she', 'He', 'he', 'His', 'his', 'Her', 'her', 'Him', 'him',
    'They', 'they', 'Them', 'them', 'We', 'we', 'Us', 'us', 'I', 'Me', 'me'
]

function analyzeUrl(url, callback) {
    webReader.extractWebContent(url, function(err_1, article) {
        if (err_1) {
            callback(err_1, null)
        } else {
            //content
            getCoreFeature(article.content, function(err_2, analyzedContent) {
                if (err_2) {
                    callback(err_2, null)
                } else {
                    //the title
                    getCoreFeature(article.title, function(err_3, analyzedTitle) {
                        console.log("Article title: " + article.title)
                        if (err_3) {
                            callback(err_3, null)
                        } else {
                            //right now, just push 2 of them in an array.
                            //but I kind of want the title to be more powerful, more close
                            //to the final result,
                            //but maybe just add a weight value would be enough.
                            let finalResponse = {};
                            finalResponse.url = url
                            finalResponse.title = article.title
                            finalResponse.analyzedTitle = analyzedTitle
                            finalResponse.analyzedContent = analyzedContent
                            callback(null, finalResponse);
                        }
                    })
                }
            })
        }
    })
}

function getCoreFeature (paragraph, callback) {
    annotateParagraph(paragraph, function(error, response) {
        if (error) {
            callback(error, null)
        } else {
            _getFeatureFromAnnotatedData(response, callback)
        }
    })
}

function analyzeUrlAndAddToDb(url, callback) {
    analyzeUrl(url, (err, res) => {
        if (err) {
            callback(err)
        } else {
            dbWriter.checkAndWriteToDb(res, (err) => {
                if (err) {
                    console.log('Error trying to write analyzed content to the local db')
                    callback(err, null)
                } else {
                    callback(null, res)
                }
            })
        }
    })
}

/*
 The NLP function return the paragraph in an array of sentences that are analyzed by the service.
 What I do in this function is to pick only the neccessary information that will be needed for future use
 Which is Sentiment value and the Named Entity recognition
 */
function annotateParagraph(paragraph, callback) {
    _requestNlpAnnotation(paragraph, function(error, response, body) {
        if (!error) {
            if (response.statusCode == 200) {
                console.log('Successfully receive annotation from the Core NLP server!')
                let annotatedSentences = body.sentences;
                let returnSentences = [];
                for (let i = 0; i < annotatedSentences.length; i ++) {
                    let sentence = {};
                    //sentiment
                    sentence.sentiment = annotatedSentences[i].sentiment
                    sentence.sentimentValue = annotatedSentences[i].sentimentValue
                    //named entities
                    sentence.entities = [];
                    for (let j = 0; j < annotatedSentences[i].entitymentions.length; j ++) {
                        let entities = {}
                        entities.text = annotatedSentences[i].entitymentions[j].text
                        entities.ner = annotatedSentences[i].entitymentions[j].ner
                        sentence.entities.push(entities);
                    }
                    //OpenIE extraction
                    sentence.openie = []
                    for (let j = 0; j < annotatedSentences[i].openie.length; j ++) {
                        let triplet = annotatedSentences[i].openie[j]
                        let returnTriplet = {}
                        returnTriplet.subject = triplet.subject
                        returnTriplet.relation = triplet.relation
                        returnTriplet.object = triplet.object
                        sentence.openie.push(returnTriplet)
                    }
                    // Token counts = number of text in the sentence
                    // Character counts = number of characters in the sentence
                    sentence.tokensCount = annotatedSentences[i].tokens.length
                    let offsetBegin = annotatedSentences[i].tokens[0].characterOffsetBegin;
                    sentence.charactersCount = +annotatedSentences[i].tokens[sentence.tokensCount - 1].characterOffsetEnd - +offsetBegin;
                    // sentence.characterLength = annotatedSentences[i].tokens[sentence.tokenNumber - 1].characterOffsetEnd;
                    // sentence.tokens = annotatedSentences[i].tokens
                    returnSentences.push(sentence)
                }
                callback(null, returnSentences);
            } else {
                callback({'statusCode':statusCode}, null)
            }
        } else {
            console.log("ERROR Annotating the paragraph!!!!!!!!!!!");
            callback(error, null)
        }
    })
}

function _getFeatureFromAnnotatedData(annotatedResult, callback) {
    let returnValue = {};
    let sentencesCount = annotatedResult.length;
    let charactersCount = 0
    let averageSentimentValue = 0;
    let entitiesList = [];
    //loop through every sentences
    for (let i= 0; i < sentencesCount; i ++) {
        charactersCount = +charactersCount + +annotatedResult[i].charactersCount
        averageSentimentValue = +averageSentimentValue + +annotatedResult[i].sentimentValue;
        //Check if the sentence have any Named entity,
        //Then,we should record it, as well as its sentiment value.
        //Loop through every entities inside the sentence
        for (let j = 0; j < annotatedResult[i].entities.length; j ++) {
            if (_shouldSaveEntity(annotatedResult[i].entities[j])) {
                if (_isEntityAlreadyExist(entitiesList, annotatedResult[i].entities[j])) {
                    for (let k = 0; k < entitiesList.length; k ++) {
                        if (entitiesList[k].text == annotatedResult[i].entities[j].text) {
                            //a little bit complicated to get the average sentiment value of the things.
                            let sum = entitiesList[k].sentimentValue * entitiesList[k].timesAppear;
                            sum = +sum + +annotatedResult[i].sentimentValue;
                            entitiesList[k].timesAppear ++;
                            entitiesList[k].sentimentValue = sum / entitiesList[k].timesAppear;
                            entitiesList[k].appearIn.push(i)
                        }
                    }
                } else {
                    let myEntity = {};
                    myEntity.text = annotatedResult[i].entities[j].text;
                    myEntity.ner = annotatedResult[i].entities[j].ner;
                    myEntity.sentimentValue = annotatedResult[i].sentimentValue;
                    myEntity.timesAppear = 1;
                    myEntity.appearIn = [];
                    myEntity.appearIn.push(i)
                    entitiesList.push(myEntity)
                }
            }
        }
    }

    let discreteEntities = []
    let abstractEntities = []

    for(let i = 0; i < entitiesList.length; i ++) {
        if (isDiscreteEntity(entitiesList[i])) {
            discreteEntities.push(entitiesList[i])
        } else {
            abstractEntities.push(entitiesList[i])
        }
    }
    averageSentimentValue = +averageSentimentValue / +sentencesCount;
    returnValue.sentimentValue = averageSentimentValue;

    returnValue.sentencesCount = sentencesCount;
    returnValue.charactersCount = charactersCount;

    returnValue.discreteEntities = discreteEntities;
    returnValue.abstractEntities = abstractEntities;

    callback(null, returnValue);
}

//check if the entity is already inside the list or not.
function _isEntityAlreadyExist(entitiesList, entity) {
    for (let i = 0; i < entitiesList.length; i ++) {
        if (entitiesList[i].text == entity.text) {
            return true
        }
    }
    return false
}

//return true if it's people, organization and stuffs
//false if number and nonsense like that.
function _shouldSaveEntity(entity) {
    return (((discreteNerList.indexOf(entity.ner) != -1)
        || (abstractNerList.indexOf(entity.ner) != -1))
        && (ignoreTextList.indexOf(entity.text) == -1));
}

//check if that entity is individual entity or abstract entity
function isDiscreteEntity(entity) {
    return (discreteNerList.indexOf(entity.ner) != -1);
}

//This function request an annotation from the Stanford Core NLP Web Services
function _requestNlpAnnotation(content, callback) {
    request.post(
        urlBuilder.getDefaultURL(),
        { json: content},
        function (error, response, body) {
            callback(error, response, body)
        }
    );
}

module.exports.annotateParagraph = annotateParagraph;
module.exports.getCoreFeature = getCoreFeature;
module.exports.analyzeUrl = analyzeUrl;
module.exports.analyzeUrlAndAddToDb = analyzeUrlAndAddToDb
module.exports.isDiscreteEntity = isDiscreteEntity
// module.exports.requestNlpAnnotation = _requestNlpAnnotation