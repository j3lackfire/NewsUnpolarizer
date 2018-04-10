/**
 * Created by Le Pham Minh Duc on 08-Apr-18.
 */
//This function will be used to populate the database with a lot of news for the function to analyze
// The url of the article
const fs = require('fs') //file system to save the file

const paragraphAnnotator = require('./../NLPHandler/annotator')
const dbReader = require('./dbReader')

let baseFilePath = __dirname + '/DB/'

let dbName = dbReader.dbName
let logFileName = 'url.txt'

let articleUrls = [
]


//Add stuffs to articles URL array
//Run this command so this automatically annotate articles
// generateDB(0)


// what we should do is read the file, parse it to a json file, add new info to the json
// and save it again
//Single entries
function checkAndWriteToDbSingle(singleJson, callback) {
    dbReader.readDbAsJson((err, response) => {
        if (err) {
            if (err == 'not exist!') {
                console.log('Create new')
                myArray = []
                myArray.push(singleJson)
                _writeToDb(myArray, (err) => {
                    if (err) callback(err)
                    else{
                        _writeLog(singleJson.url, callback)
                    }
                })
            } else{
                callback(err, null)
            }
        } else {
            response.push(singleJson)
            _writeToDb(response, (err) => {
                if (err) callback(err)
                else{
                    _appendLog(singleJson.url, callback)
                }
            })
        }
    })
}


//Write a new file to the db
function _writeToDb(content, callback) {
    // console.log(util.inspect(content, {showHidden: false, depth: null}))
    fs.writeFile(baseFilePath + dbName, JSON.stringify(content, null, 2), 'utf8',(err) => {
        if (err) {
            callback(err)
        } else {
            callback(null)
        }
    });
}

function _isNullOrUndefined(param) {
    return (param == null || param == '' || typeof (param) == 'undefined')
}

//a way smaller list file to save all of the url I have read
function _writeLog(url, callback) {
    fs.writeFile(baseFilePath + logFileName, url + ',\n', 'utf8', (err) => {
        if (err) {
            callback(err)
        } else {
            callback(null)
        }
    })
}

function _appendLog(url, callback) {
    fs.appendFile(baseFilePath + logFileName, url + ',\n', 'utf8', function (err) {
        if (err) {
            callback(err)
        } else {
            callback(null)
        }
    });
}

// annotator.analyzeUrl(articleUrls[1], (err, res) => {
//     if (err) {
//         console.log(err)
//     } else {
//         // console.log(res)
//         checkAndWriteToDbSingle(res, (err) => {
//             if (err) {
//                 console.log(err);
//             }else {
//                 console.log('The file has been saved!');
//             }
//         })
//     }
// })

function generateDB(index) {
    paragraphAnnotator.analyzeUrl(articleUrls[index], (err, res) => {
        if (err) {
            console.log(err)
        } else {
            // console.log(res)
            checkAndWriteToDbSingle(res, (err) => {
                if (err) {
                    console.log(err);
                }else {
                    console.log('The file has been saved!');
                    let newIndex = index  + 1
                    if (newIndex  < articleUrls.length) {
                        generateDB(newIndex)
                    }
                }
            })
        }
    })
}

module.exports.checkAndWriteToDb = checkAndWriteToDbSingle

