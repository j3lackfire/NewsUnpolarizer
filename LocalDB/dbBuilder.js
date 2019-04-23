/**
 * Created by Le Pham Minh Duc on 06-Oct-18.
 */
const coreFeatureExtractor = require('./../NLPHandler/coreFeatureExtractor')
const summarizer = require('./../NewsGatherer/summarizer')
const utils = require('./../utils')
const dbWriter = require('./dbWriter')
const dbReader = require('./dbReader')

//A db entry would contain meta data of the article and the annotated article
function generateDbEntry(url, callback) {
    coreFeatureExtractor.extractCoreFeaturesAndEntitiesAndMetaFromUrl(url, (err, res) => {
        if (err) {
            console.error("Error summarizing the url!!! " + err)
            callback(err, null)
        } else{
            dbWriter.checkAndWriteToDb(res, (err_3) => {
                if (err_3) {
                    console.error("eh ?")
                    callback(err_3)
                } else {
                    console.log("Successfully write the core feature to the database!")
                    console.log(url)
                    callback(null)
                }
            })
        }
    })
}

function populateDatabase(index, urlsList, callback) {
    generateDbEntry(urlsList[index], (err) => {
        let newIndex = index + 1
        if (err) {
            console.log("Error while generating the DB Entry for " + urlsList[index])
        } else {
            console.log("Successfully generate db entry for " + urlsList[index])
        }
        if (newIndex < urlsList.length) {
            populateDatabase(newIndex, urlsList, callback)
        } else {
            callback(null)
        }
    })
}

function _getUrlsNotInDb(urls, callback) {
    utils.getAllUrlsInDb((dbUrls) => {
        if (dbUrls == null) {
            console.error("DB urls is null, stop!")
        } else {
            let returnUrls = []
            for (let j = 0; j < urls.length; j ++) {
                if (!dbUrls.includes(urls[j])) {
                    returnUrls.push(urls[j])
                }
            }
            callback(returnUrls)
        }
    })
}

const lineReader = require('line-reader');

console.log("HELLO WORLD")
let urls = []
lineReader.eachLine('urls.txt', function(line, last) {
    urls.push(line)
    // do whatever you want with line...
    if(last){
        urls.push(line)
        _getUrlsNotInDb(urls, (uniqueUrls) => {
            populateDatabase(0, uniqueUrls, (err) => {
                if (err) {

                } else {
                    console.log("DONE populate the database!")
                }
            })
        })
    }
})


