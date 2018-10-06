/**
 * Created by Le Pham Minh Duc on 08-Apr-18.
 */
/*
    This module utilize the smmry APIs, to automatically summary an article
*/
const request = require('request');

let apiKey = 'E84A0513B7'
let apiURL = 'https://api.smmry.com'
let defaultSentencesLenght = 7
//SM_LENGTH = the number of sentences - default 7
//https://api.smmry.com/&SM_API_KEY=E84A0513B7&SM_URL=https://www.huffingtonpost.com/entry/michigan-declares-flints-water-restored_us_5ac7b81be4b0337ad1e7df07
function _generateBaseRequest() {
    return apiURL + '/&SM_API_KEY=' + apiKey;
}

function _generateSummaryUrlRequest(url, length) {
    let lengthParam = "&SM_LENGTH="
    if (typeof(length) == 'undefined' || length == null || length <= 0) {
        lengthParam += defaultSentencesLenght.toString()
    } else {
        lengthParam += length.toString()
    }
    return _generateBaseRequest() + lengthParam + '&SM_URL=' + url
}

function _summaryUrl(url, summaryLength, callback) {
    console.log("_summaryUrl " + summaryLength)
    request( _generateSummaryUrlRequest(url, summaryLength), function (error, response, body) {
        console.log(_generateSummaryUrlRequest(url, summaryLength))
        if (error) {
            console.log('Error happens when trying to summarize url')
            callback(error, null);
        } else {
            let responseBody = JSON.parse(body)
            console.log(responseBody.sm_api_limitation)
            callback(null, responseBody)
            // let suitableLength = _getSuitableSummaryLength(summaryLength, responseBody.sm_api_content_reduced)
            // if (suitableLength == summaryLength) {
            //     callback(null, responseBody)
            // } else {
            //     _summaryUrl(url, suitableLength, callback)
            // }
        }
    });
}

//if the percent is from 40~60%, it's good
function _getSuitableSummaryLength(currentLength, _percentReduced) {
    let percentReduced = parseInt(_percentReduced.split('%')[0])
    if (percentReduced > 40 && percentReduced < 60) {
        return currentLength
    }
    let currentPercentage = 100 - percentReduced
    let averageSentencePercentage = currentPercentage / currentLength
    return Math.abs(Math.ceil(50 / averageSentencePercentage))
}

//example usage of the things.
// _summaryUrl(
//     'http://nbc25news.com/news/flint-water-woes/state-ends-water-distribution-in-flint',
//     -1,
//     function(err, response) {
//         if (err) {
//             console.log(err)
//         } else{
//             console.log(response.sm_api_character_count);
//             console.log(response.sm_api_content_reduced);
//             console.log(response.sm_api_title);
//             console.log(response.sm_api_content);
//             console.log(response.sm_api_limitation);
//         }
//     }
// );

module.exports.summaryUrl = _summaryUrl;
