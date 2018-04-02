/**
 * Created by Le Pham Minh Duc on 31-Mar-18.
 */
const request = require('request');
const urlBuilder = require('./urlBuilder')

console.log(urlBuilder.getDefaultURL());

let savedNerList = ['PERSON',
    'LOCATION',
    'ORGANIZATION',
    'MISC',
    'CITY',
    'STATE_OR_PROVINCE',
    'COUNTRY',
    'NATIONALITY',
    'RELIGION',
    'TITLE',
    'IDEOLOGY'];

// annotateParagraph('random test. please ignore', function(err, res) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(res);
//     }
// })

function getCoreFeature (paragraph, callback) {
    annotateParagraph(paragraph, function(error, response) {
        if (error) {
            callback(error, null)
        } else {
            getFeatureFromAnnotatedData(response, callback)
        }
    })
}

function getFeatureFromAnnotatedData(annotatedResult, callback) {
    let returnValue = {};
    let numberOfSentences = annotatedResult.length;
    console.log('numberOfSentences: ' + numberOfSentences)
    let averageSentimentValue = 0;
    let entitiesList = [];
    for (let i= 0; i < numberOfSentences; i ++) {
        averageSentimentValue = +averageSentimentValue + +annotatedResult[i].sentimentValue;
        //should check if the sentence have any Named entity and if we should record it, as well as its sentiment value.
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
                        }
                    }
                } else {
                    let myEntity = {};
                    myEntity.text = annotatedResult[i].entities[j].text;
                    myEntity.ner = annotatedResult[i].entities[j].ner;
                    myEntity.sentimentValue = annotatedResult[i].sentimentValue;
                    myEntity.timesAppear = 1;
                    entitiesList.push(myEntity)
                }
            }
        }
    }
    averageSentimentValue = +averageSentimentValue / +numberOfSentences;
    returnValue.sentimentValue = averageSentimentValue;
    returnValue.entitiesList = entitiesList;
    callback(null, returnValue);
    //save everything in the return value and return it
}

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
    return (savedNerList.indexOf(entity.ner) != -1);
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
                console.log('Successfully receive stuff from the server!')
                let sentencesList = [];
                for (var i = 0; i < body.sentences.length; i ++) {
                    let sentence = {};
                    sentence.sentiment = body.sentences[i].sentiment
                    sentence.sentimentValue = body.sentences[i].sentimentValue
                    // sentence.sentimentDistribution = body.sentences[i].sentimentDistribution
                    sentence.entities = [];
                    for (var j = 0; j < body.sentences[i].entitymentions.length; j ++) {
                        let entities = {};
                        entities.text = body.sentences[i].entitymentions[j].text
                        entities.ner = body.sentences[i].entitymentions[j].ner
                        sentence.entities.push(entities);
                    }

                    sentence.tokensLength = body.sentences[i].tokens.length
                    // sentence.characterLength = body.sentences[i].tokens[sentence.tokenNumber - 1].characterOffsetEnd;
                    // sentence.tokens = body.sentences[i].tokens
                    sentencesList.push(sentence)
                }
                callback(null, sentencesList);
            } else {
                callback({'statusCode':statusCode}, null)
            }
        } else {
            console.log("ERROR !!!!!!!!!!!");
            callback(error, null)
        }
    })
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