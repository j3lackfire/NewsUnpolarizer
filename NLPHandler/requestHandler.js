/**
 * Created by Le Pham Minh Duc on 31-Mar-18.
 */
const request = require('request');
const urlBuilder = require('./urlBuilder')

// let myContent = 'Mattis jokes to Bolton: \'I heard you\'re actually the devil incarnate and I wanted to meet you'

let myContent = "Google Cloud Natural Language reveals the structure and meaning of text by offering powerful machine learning models in an easy to use REST API. You can use it to extract information about people, places, events and much more, mentioned in text documents, news articles or blog posts. You can use it to understand sentiment about your product on social media or parse intent from customer conversations happening in a call center or a messaging app. You can analyze text uploaded in your request or integrate with your document storage on Google Cloud Storage."

console.log(urlBuilder.getDefaultURL());

annotate(myContent, function(error, response, body) {
    if (!error) {
        if (response.statusCode == 200) {
            console.log('Successfully receive stuff from the server!')
            // console.log(body);
            for (var i = 0; i < body.sentences.length; i ++) {
                console.log('-----------Sentence:------------');
                console.log(body.sentences[i].sentiment);
                console.log(body.sentences[i].sentimentValue);
                console.log(body.sentences[i].entitymentions)
            }
            // console.log(body.sentences[0]);
        } else {
            console.log(response.statusCode)
            console.log(body)
        }
    } else {
        console.log(error)
    }
});

function annotate(content, callback) {
    request.post(
        urlBuilder.getDefaultURL(),
        { json: content},
        function (error, response, body) {
            callback(error, response, body)
     }
    );
}

// request.post(
//     urlBuilder.getDefaultURL(),
//     { json: myContent },
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//             console.log(body)
//         }
//     }
// );
