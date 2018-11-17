/**
 * Created by Le Pham Minh Duc on 31-Mar-18.
 */
const request = require('request');
const webReader = require('./../NewsGatherer/legacy/webContentReader')

const urlBuilder = require('./nlpUrlBuilder')
const dbWriter = require('./../LocalDB/dbWriter')

console.log('Default request URL to send to core NLP');
console.log(urlBuilder.getDefaultURL());

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
// function annotateParagraph(paragraph, callback) {
//     requestNlpAnnotation(paragraph, (error, nlpAnnotation) => {
//         if (error) {
//             console.error("ERROR Annotating the paragraph!!!!!!!!!!!");
//             callback(error, null)
//         } else {
//             console.log('Successfully receive annotation from the Core NLP server!')
//             let annotatedSentences = nlpAnnotation;
//             let returnSentences = [];
//             for (let i = 0; i < annotatedSentences.length; i ++) {
//                 let sentence = {};
//                 //sentiment
//                 sentence.sentiment = annotatedSentences[i].sentiment
//                 sentence.sentimentValue = annotatedSentences[i].sentimentValue
//                 //named entities
//                 sentence.entities = [];
//                 for (let j = 0; j < annotatedSentences[i].entitymentions.length; j ++) {
//                     let entities = {}
//                     entities.text = annotatedSentences[i].entitymentions[j].text
//                     entities.ner = annotatedSentences[i].entitymentions[j].ner
//                     sentence.entities.push(entities);
//                 }
//                 //OpenIE extraction
//                 sentence.triplets = []
//                 for (let j = 0; j < annotatedSentences[i].openie.length; j ++) {
//                     let triplet = annotatedSentences[i].openie[j]
//                     let returnTriplet = {}
//                     returnTriplet.subject = triplet.subject
//                     returnTriplet.relation = triplet.relation
//                     returnTriplet.object = triplet.object
//                     sentence.triplets.push(returnTriplet)
//                 }
//                 // Token counts = number of text in the sentence
//                 // Character counts = number of characters in the sentence
//                 sentence.tokensCount = annotatedSentences[i].tokens.length
//                 let offsetBegin = annotatedSentences[i].tokens[0].characterOffsetBegin;
//                 sentence.charactersCount = +annotatedSentences[i].tokens[sentence.tokensCount - 1].characterOffsetEnd - +offsetBegin;
//                 // sentence.characterLength = annotatedSentences[i].tokens[sentence.tokenNumber - 1].characterOffsetEnd;
//                 sentence.tokens = annotatedSentences[i].tokens
//                 returnSentences.push(sentence)
//             }
//             callback(null, returnSentences);
//         }
//     })
// }

function requestNlpAnnotation(content, callback) {
    request.post(
        urlBuilder.getDefaultURL(),
        { json: content},
        function (error, response, body) {
            if (error) {
                console.error("ERROR trying to get result from core nlp annotator");
                callback(error, null)
            } else {
                if (response.statusCode != 200) {
                    callback({'statusCode':response.statusCode}, null)
                } else {
                    callback(null, body.sentences)
                }
            }
        }
    );
}


module.exports.requestNlpAnnotation = requestNlpAnnotation
module.exports.analyzeUrlAndAddToDb = analyzeUrlAndAddToDb
