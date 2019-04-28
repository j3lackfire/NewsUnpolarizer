const utils = require('./../utils')
const fs = require('fs') //file system to save the file

let baseFilePath = __dirname + '/DB/'
let verbDbName = "verbDb.json"

let verbDb = []

function getVerbDb(callback) {
    if (utils.isNullOrUndefined(verbDb)) {
        _readVerbDbAsJson((err, result) => {
            if (err) {
                callback([])
            } else {
                verbDb = result
                callback(verbDb)
            }
        })
    } else {
        callback(verbDb)
    }
}

function _readVerbDbAsJson(callback) {
    _readFile(verbDbName, (err, response) => {
        if (err) {
            fs.writeFile(baseFilePath + dbName, '[]', function (err) {
                if (err) throw err;
                console.log('VERB DB not exist, create new!');
                callback(null, [])
            });
        } else {
            let jsonObject = null
            try {
                jsonObject = JSON.parse(response)
            } catch (e) {
                console.log( 'Error parsing the VERB DB to JSON format')
                jsonObject = null
            }

            if (jsonObject == null) {
                callback('not exist!', null)
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

function writeToDb(content, callback) {
    // console.log(util.inspect(content, {showHidden: false, depth: null}))
    fs.writeFile(baseFilePath + verbDbName, JSON.stringify(content, null, 2), 'utf8',(err) => {
        if (err) {
            console.error("ERROR WRITING the file to the hard drive????")
            callback(err)
        } else {
            callback(null)
        }
    });
}

module.exports.getVerbDb = getVerbDb
module.exports.writeToDb = writeToDb