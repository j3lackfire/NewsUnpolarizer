/**
 * Created by Le Pham Minh Duc on 31-Mar-18.
 */
const request = require('request');
const webReader = require('./../NewsGatherer/webContentReader')

const urlBuilder = require('./nlpUrlBuilder')
const dbWriter = require('./../LocalDB/dbWriter')

console.log('Default request URL to send to core NLP');
console.log(urlBuilder.getDefaultURL());

function analyzeUrl(url, callback) {
    webReader.extractWebContent(url, function(err_1, article) {
        if (err_1) {
            callback(err_1, null)
        } else {
            //content
            console.log("\n\nTrying to get the core features")
            console.log(article.content)
            console.log(article.title)
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
 And the OpenIE annotation
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
module.exports.analyzeUrl = analyzeUrl;
module.exports.analyzeUrlAndAddToDb = analyzeUrlAndAddToDb
