/**
 * Created by Le Pham Minh Duc on 14-Nov-18.
 */
//Legacy version of the db Writer. I will write a new one, so this one take the dust
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
    dbReader.readDbAsJson((err, response) => {
        if (err) {
            if (err == 'not exist!') {
                myArray = []
                myArray.push(_coreFeatureJson)
                _writeToDb(myArray, callback)
            } else{
                callback(err)
            }
        } else {
            response.push(_coreFeatureJson)
            _writeToDb(response, callback)
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
            let articleUrl = Array.isArray(content) ? content[content.length - 1].url : content.url
            _appendLog(articleUrl, (err) => {
                if (err) {
                    console.log('Error happening writing the url log to the db')
                    callback(err)
                } else {
                    let coreFeatures = Array.isArray(content) ? content[content.length - 1] : content;
                    updateEntitiesPopularity(coreFeatures, callback)
                }
            })
        }
    });
}

function updateEntitiesPopularity(content, callback) {
    dbReader.readEntitiesPopularity((err, res) => {
        let entitiesPopularityList = err ? [] : res

        entitiesPopularity.checkAndUpdateEntitiesInfo(content.analyzedContent.discreteEntities, entitiesPopularityList);
        entitiesPopularity.checkAndUpdateEntitiesInfo(content.analyzedContent.abstractEntities, entitiesPopularityList);
        entitiesPopularity.updateAndRankEntitiesPopularity(entitiesPopularityList)

        fs.writeFile(
            baseFilePath + dbReader.entitiesPopularityName,
            JSON.stringify(entitiesPopularityList, null, 2),
            'utf8', (error) => {
                if (error) {
                    console.log('Error writing the entity details to the lobal DB')
                    callback(error)
                } else {
                    callback(null)
                }
            })
    })
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

function generateDB(index) {
    if (articleUrls.length == 0) {
        console.log('There is no article to analyze!!!')
        return;
    }
    console.log(articleUrls[index])
    annotator.analyzeUrl(articleUrls[index], (err, res) => {
        if (err) {
            console.log(err)
            if (err == 'Too short!') {
                let skipIndex = index + 1
                if (skipIndex < articleUrls.length) {
                    generateDB(skipIndex)
                }
            }
        } else {
            // console.log(res)
            checkAndWriteToDbSingle(res, (err) => {
                if (err) {
                    console.log(err);
                }else {
                    console.log('The file has been saved!');

                }
                let newIndex = index  + 1
                if (newIndex  < articleUrls.length) {
                    generateDB(newIndex)
                }
            })
        }
    })
}

module.exports.checkAndWriteToDb = checkAndWriteToDbSingle

