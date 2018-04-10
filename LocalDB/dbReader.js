/**
 * Created by Le Pham Minh Duc on 08-Apr-18.
 */
/*
    To read the file and the annotation
*/
const fs = require('fs') //file system to save the file

let baseFilePath = __dirname + '/DB/'

let dbName = 'annotatedArticles.json'

function readDbAsJson(callback) {
    _readFile(dbName, (err, response) => {
        if (err) {
            callback(err, null)
        } else {
            try {
                let jSonObject = JSON.parse(response)
                callback(null, jSonObject)
            }
            catch (e) {
                console.log('Dead lock in the db reader, it might be the Local DB is wrong, or it has cautch another error from external module')
                // callback('Can not parse the string data to JSON', null)
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