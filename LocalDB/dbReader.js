/**
 * Created by Le Pham Minh Duc on 08-Apr-18.
 */
/*
    To read the file and the annotation
*/
const fs = require('fs') //file system to save the file

let baseFilePath = __dirname + '/DB/'
let notExistError = 'not exist!'

let dbName = 'annotatedArticles.json'

function readDbAsJson(callback) {
    _readFile(dbName, (err, response) => {
        if (err) {
            callback(err, null)
        } else {
            let jsonObject = null
            try {
                jsonObject = JSON.parse(response)
            } catch (e) {
                console.log( 'Error parsing the localDb to JSON format')
                jsonObject = null
            }

            if (jsonObject == null) {
                callback(notExistError, null)
            } else {
                callback(null, jsonObject)
            }
        }
    })
}

function isUrlAlreadyAnnotated(url, callback) {
    readDbAsJson((err, annotatedArticles) => {
        if (err) {
            callback(err, null)
        } else {
            for (let i = 0; i < annotatedArticles.length; i ++) {
                if (url === annotatedArticles[i].meta.url) {
                    callback(null, true)
                    return
                }
            }
            callback(null, false)
        }
    })
}

function _readFile(_fileName, callback) {
    fs.readFile(baseFilePath + _fileName, 'utf8', (err, data) => {
        if (err) {
            console.log('Error reading the file ' + _fileName)
            callback(err, null)
        } else {
            callback(null, data)
        }
    })
}

module.exports.dbName = dbName
module.exports.notExistError = notExistError

module.exports.isUrlAlreadyAnnotated = isUrlAlreadyAnnotated
module.exports.readDbAsJson = readDbAsJson
