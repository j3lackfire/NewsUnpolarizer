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
    "https://www.independent.co.uk/news/world/middle-east/syria-civil-war-rocket-attack-damascus-dead-injured-assad-a8265896.html",
    "https://www.reuters.com/article/us-mideast-crisis-syria-damascus/scores-killed-in-rocket-attack-on-damascus-market-and-rebel-held-douma-idUSKBN1GW2I1",
    "http://www.bbc.com/news/world-middle-east-43850979",
    "https://www.channel4.com/news/factcheck/syria-chemical-attack-the-evidence",
    "https://www.nytimes.com/2018/04/19/world/middleeast/syria-strikes.html",
    "http://www.bbc.com/news/world-middle-east-39500947",
    "https://www.washingtonpost.com/world/chemical-weapons-coverup-suspected-in-syria-as-inspectors-remain-blocked/2018/04/20/1ca0f164-440a-11e8-b2dc-b0a403e4720a_story.html?noredirect=on&utm_term=.d5e5b15c1c1c",
    "https://www.nytimes.com/2018/04/11/world/middleeast/syria-chemical-attack.html"
]

//Add stuffs to articles URL array
//Run this command so this automatically annotate articles
generateDB(0)

// what we should do is read the file, parse it to a json file, add new info to the json
// and save it again
//Single entries
function checkAndWriteToDbSingle(_coreFeatureJson, callback) {
    dbReader.readDbAsJson((err, response) => {
        if (err) {
            if (err == 'not exist!') {
                console.log('Create new')
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
            console.log(articleUrl)
            _appendLog(articleUrl, callback)
        }
    });
}

function updateEntitiesDetail(content, callback) {

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

