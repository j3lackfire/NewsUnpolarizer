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

function summaryUrl(url, callback) {
    _localSummaryUrl(url, -1, callback)
}

function _localSummaryUrl(url, summaryLength, callback) {
    console.log(_generateSummaryUrlRequest(url, summaryLength))
    request( _generateSummaryUrlRequest(url, summaryLength), function (error, response, body) {
        if (error) {
            console.log('Error happens with requesting SMMRY')
            callback(error, null);
        } else {
            let responseBody = JSON.parse(body)
            if (responseBody.sm_api_error) {
                console.log('Error at the SMMRY server - ' + responseBody.sm_api_message)
                callback(responseBody.sm_api_message, null);
            } else {
                console.log(responseBody.sm_api_limitation)
                callback(null, responseBody)
                // let suitableLength = _getSuitableSummaryLength(summaryLength, responseBody.sm_api_content_reduced)
                // if (suitableLength == summaryLength) {
                //     callback(null, responseBody)
                // } else {
                //     _localSummaryUrl(url, suitableLength, callback)
                // }
            }
        }
    });
}

//if the percent is bigger than 60%, it's good
function _getSuitableSummaryLength(currentLength, _percentReduced) {
    let percentReduced = parseInt(_percentReduced.split('%')[0])
    if (percentReduced < 40) {
        return currentLength
    }
    let currentPercentage = 100 - percentReduced
    let averageSentencePercentage = currentPercentage / currentLength
    return Math.abs(Math.ceil(70 / averageSentencePercentage))
}

//example usage of the things.
// response.sm_api_character_count
// response.sm_api_content_reduced
// response.sm_api_title
// response.sm_api_content
// response.sm_api_limitation

module.exports.summaryUrl = summaryUrl;
