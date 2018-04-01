/**
 * Created by Le Pham Minh Duc on 31-Mar-18.
 */
const request = require('request');
const urlBuilder = require('./urlBuilder')

console.log(urlBuilder.getDefaultURL());

// annotateParagraph('random test. please ignore', function(err, res) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(res);
//     }
// })

function getCoreFeature(annotatedResult, callback) {
    let returnValue = {};
    let numberOfSentences = annotatedResult.length;
    let averageSentiment = 0;
    for (let i= 0; i < numberOfSentences; i ++) {
        averageSentiment += annotatedResult[i].sentiment;
        //should check if the sentence have any Named entity and if we should record it, as well as its sentiment value.
    }
    averageSentiment /= numberOfSentences;
    returnValue.sentiment = averageSentiment;

    //save everything in the return value and return it
}

//Because the system also record stuff like student, numbers and weather,
//for the purpose of this, I will only record
function _shouldSaveEntity() {
    //return true if it's people, organization and stuffs
    //false if number and nonsense like that.
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
                        let entity = {};
                        entity.text = body.sentences[i].entitymentions[j].text
                        entity.ner = body.sentences[i].entitymentions[j].ner
                        sentence.entities.push(entity);
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
