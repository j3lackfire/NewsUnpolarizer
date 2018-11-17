/**
 * Created by Le Pham Minh Duc on 08-Apr-18.
 */
/*
    This module utilize the smmry APIs, to automatically summary an article
*/
const request = require('request');

let apiKey = 'E84A0513B7'
let apiURL = 'https://api.smmry.com'
let defaultSentencesLenght = 40 // 40 is the maximum value, if the whole paragraph article is shorter than 40 sentences, it's will return the whole article
//so, this is a good way to filter out all of the random html stuffs inside the article
//SM_LENGTH = the number of sentences - default 7
//https://api.smmry.com/&SM_API_KEY=E84A0513B7&SM_URL=https://www.huffingtonpost.com/entry/michigan-declares-flints-water-restored_us_5ac7b81be4b0337ad1e7df07
function _generateBaseRequest() {
    return apiURL + '/&SM_API_KEY=' + apiKey + '&SM_LENGTH=' + defaultSentencesLenght;
}

function _generateSummaryUrlRequest(url) {
    return _generateBaseRequest() + '&SM_URL=' + url
}

function summaryUrl(url, callback) {
    request( _generateSummaryUrlRequest(url), function (error, response, body) {
        if (error) {
            console.error('Error happens with requesting SMMRY')
            callback(error, null);
        } else {
            let responseBody = JSON.parse(body)
            if (responseBody.sm_api_error) {
                console.error('Error at the SMMRY server - ' + responseBody.sm_api_message)
                callback(responseBody.sm_api_message, null);
            } else {
                console.log(responseBody.sm_api_limitation)
                callback(null, responseBody)
            }
        }
    });
}

function urlToParagraph(url, callback) {
    summaryUrl(url, (err, response) => {
        if (err) {
            callback(err, null)
        } else {
            callback(null, response.sm_api_content)
        }
    })
}

//example usage of the things.
// response.sm_api_character_count
// response.sm_api_content_reduced
// response.sm_api_title
// response.sm_api_content
// response.sm_api_limitation

module.exports.summaryUrl = summaryUrl;
module.exports.urlToParagraph = urlToParagraph