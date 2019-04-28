/**
 * Created by Le Pham Minh Duc on 27-Apr-19.
 */

const utils = require('./../../utils')
const thesaurusConnector = require('./thesaurusConnector')
const localVerbDb = require('./../../LocalDB/verbDbController')


function getVerbResult(verb, callback) {
    _getVerbFromDb(verb, (dbResult) => {
        if (dbResult) {
            callback(dbResult)
        } else {
            console.log()
            callback(null)
            //Not needed because word don't exist in the db is word doesn't exist in the thesaurus server.
            // thesaurusConnector.getVerbResult(verb, (error, webResult) => {
            //     if (error) {
            //         console.log("Error getting verb result")
            //         callback(null)
            //     } else {
            //         webResult.verb = verb
            //         callback(webResult)
            //     }
            // })
        }
    })
}

function _getVerbFromDb(verb, callback) {
    _getVerbDb((verbDB) => {
        for (let i = 0; i < verbDB.length; i ++) {
            if (verbDB[i].verb == verb) {
                callback(verbDB[i])
                return
            }
        }
        callback(null)
    })
}

function _getVerbDb(callback) {
    localVerbDb.getVerbDb(callback)
}

module.exports.getVerbResult= getVerbResult