/**
 * Created by Le Pham Minh Duc on 27-Apr-19.
 */
const request = require('request');

const utils = require('./../../utils')

let apiKey = "1937493f0023194f93b09c249aec5b34"
let baseRequestUrl = "http://words.bighugelabs.com/api/2/"
let endRequestUrl = "/json"

function _generateAnnotationForVerb(verb) {
    return baseRequestUrl + apiKey + "/" + verb + endRequestUrl
}

function getVerbResult(verb, callback) {
    request(_generateAnnotationForVerb(verb), (error, response, body) => {
        if (error) {
            console.error('Error happens Thesarus connector')
            callback(error, null);
        } else {
            if (response.statusCode != 200) {
                callback("Internal service error!", null)
            } else {
                let responseBody = JSON.parse(body)
                if (utils.isNullOrUndefined(responseBody.verb)) {
                    callback("Not a verb!", null)
                } else {
                    callback(null, responseBody.verb)
                }
            }
        }
    })
}

module.exports.getVerbResult = getVerbResult