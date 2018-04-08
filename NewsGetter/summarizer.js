/**
 * Created by Le Pham Minh Duc on 08-Apr-18.
 */
/*
    This module utilize the smmry APIs, to automatically summary an article
*/
const request = require('request');

let apiKey = 'E84A0513B7'
let apiURL = 'https://api.smmry.com'
//SM_LENGTH = the number of sentences - default 7
function _generateBaseRequest() {
    return apiURL + '/&SM_API_KEY=' + apiKey;
}

function _generateSummaryUrlRequest(url) {
    return _generateBaseRequest() + '&SM_URL=' + url
}

function summaryUrl(url, callback) {
    console.log(_generateSummaryUrlRequest(url));
    request( _generateSummaryUrlRequest(url), function (error, response, body) {
        if (error) {
            console.log('Error happens when trying to summarize url')
            callback(error, null);
        } else {
            callback(null, JSON.parse(body));
        }
    });
}

//example usage of the things.
// summaryUrl(
//     'http://nbc25news.com/news/flint-water-woes/state-ends-water-distribution-in-flint',
//     function(err, response) {
//         if (err) {
//                 console.log(err)
//             } else{
//                 console.log(response.sm_api_title);
//             }
//         }
// );

module.exports.summaryUrl = summaryUrl;
//https://api.smmry.com/&SM_API_KEY=E84A0513B7&SM_URL=https://www.huffingtonpost.com/entry/michigan-declares-flints-water-restored_us_5ac7b81be4b0337ad1e7df07