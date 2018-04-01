/**
 * Created by Le Pham Minh Duc on 31-Mar-18.
 */
const request = require('request');
const urlBuilder = require('./urlBuilder')


console.log(urlBuilder.getDefaultURL());

function annotateParagraph(paragraph, callback) {
    _requestNlpAnnotation(paragraph, function(error, response, body) {
        if (!error) {
            if (response.statusCode == 200) {
                console.log('Successfully receive stuff from the server!')
                let results = [];
                for (var i = 0; i < body.sentences.length; i ++) {
                    let myResult = {};
                    myResult.sentiment = body.sentences[i].sentiment
                    myResult.sentimentValue = body.sentences[i].sentimentValue
                    myResult.sentimentDistribution = body.sentences[i].sentimentDistribution
                    myResult.entities = [];
                    for (var j = 0; j < body.sentences[i].entitymentions.length; j ++) {
                        let entity = {};
                        entity.text = body.sentences[i].entitymentions[j].text
                        entity.ner = body.sentences[i].entitymentions[j].ner
                        myResult.entities.push(entity);
                    }
                    results.push(myResult)
                }
                callback(null, results);
            } else {
                callback({'statusCode':statusCode}, null)
            }
        } else {
            callback(error, null)
        }
    })
}

/*
    The NLP function return the paragraph in an array of sentences that are analyzed by the service.
    What I do in this function is to pick only the neccessary information that will be needed for future use
    Which is Sentiment value and the Named Entity recognition
*/
// _requestNlpAnnotation(myContent, function(error, response, body) {
//     if (!error) {
//         if (response.statusCode == 200) {
//             console.log('Successfully receive stuff from the server!')
//             let results = [];
//             for (var i = 0; i < body.sentences.length; i ++) {
//                 let myResult = {};
//                 myResult.sentiment = body.sentences[i].sentiment
//                 myResult.sentimentValue = body.sentences[i].sentimentValue
//                 myResult.sentimentDistribution = body.sentences[i].sentimentDistribution
//                 myResult.entities = [];
//                 for (var j = 0; j < body.sentences[i].entitymentions.length; j ++) {
//                     let entity = {};
//                     entity.text = body.sentences[i].entitymentions[j].text
//                     entity.ner = body.sentences[i].entitymentions[j].ner
//                     myResult.entities.push(entity);
//                 }
//                 results.push(myResult)
//             }
//             console.log(results);
//         } else {
//             console.log(response.statusCode)
//             console.log(body)
//         }
//     } else {
//         console.log(error)
//     }
// });

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
