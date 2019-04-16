/**
 * Created by Le Pham Minh Duc on 08-Apr-18.
 */
//This function will be used to populate the database with a lot of news for the function to analyze
// The url of the article
const fs = require('fs') //file system to save the file

const annotator = require('./../NLPHandler/nlpAnnotator')
const dbReader = require('./dbReader')
const entitiesPopularity = require('./../NLPHandler/legacy/entitiesPopularity')

let baseFilePath = __dirname + '/DB/'

let dbName = dbReader.dbName
let logFileName = 'url.txt'

// generateDB(0) //Run this command so this automatically annotate articles

// what we should do is read the file, parse it to a json file, add new info to the json
// and save it again
//Single entries
function checkAndWriteToDbSingle(_coreFeatureJson, callback) {
    if (_coreFeatureJson == null) {
        console.log("Annotated article is null, doesn't write anything!")
        callback(null)
    } else {
        dbReader.readDbAsJson((err, response) => {
            if (err) {
                if (err === dbReader.notExistError) {
                    console.log('Not thing in the file, create new')
                    myArray = []
                    myArray.push(_coreFeatureJson)
                    _writeToDb(myArray, callback)
                } else {
                    console.error("ERROR WRITING TO LOCAL DB. WTF?")
                    console.error(err)
                    callback(err)
                }
            } else {
                response.push(_coreFeatureJson)
                _writeToDb(response, callback)
            }
        })
    }
}


//Write a new file to the db
function _writeToDb(content, callback) {
    // console.log(util.inspect(content, {showHidden: false, depth: null}))
    fs.writeFile(baseFilePath + dbName, JSON.stringify(content, null, 2), 'utf8',(err) => {
        if (err) {
            console.error("ERROR WRITING the file to the hard drive????")
            callback(err)
        } else {
            callback(null)
        }
    });
}

module.exports.checkAndWriteToDb = checkAndWriteToDbSingle

