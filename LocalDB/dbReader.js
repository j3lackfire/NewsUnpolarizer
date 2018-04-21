/**
 * Created by Le Pham Minh Duc on 08-Apr-18.
 */
/*
    To read the file and the annotation
*/
const fs = require('fs') //file system to save the file

let baseFilePath = __dirname + '/DB/'

let dbName = 'annotatedArticles.json'
let entitiesDetailName = 'entitiesDetail.json'

function readDbAsJson(callback) {
    _readFile(dbName, (err, response) => {
        if (err) {
            callback(err, null)
        } else {
            let jsonObject = null
            try {
                jsonObject = JSON.parse(response)
            }
            catch (e) {
                console.log('Error parsing the localDb to JSON format')
                jsonObject = null
            }

            if (jsonObject == null) {
                callback('not exist', null)
            } else {
                callback(null, jsonObject)
            }
        }
    })
}

function readEntitiesDetailDb(callback) {
    _readFile(entitiesDetailName, (err, response) => {
        if (err) {
            callback(err, null)
        } else {
            let jsonObject = null
            try {
                jsonObject = JSON.parse(response)
            }
            catch (e) {
                console.log('Error parsing the ENTITIES details to JSON format')
                jsonObject = null
            }

            if (jsonObject == null) {
                callback('not exist', null)
            } else {
                callback(null, jsonObject)
            }

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
module.exports.readDbAsJson = readDbAsJson