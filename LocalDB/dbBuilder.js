/**
 * Created by Le Pham Minh Duc on 06-Oct-18.
 */
const coreFeatureExtractor = require('./../NLPHandler/coreFeatureExtractor')
const summarizer = require('./../NewsGatherer/summarizer')
const utils = require('./../utils')
const dbWriter = require('./dbWriter')

//A db entry would contain meta data of the article and the annotated article
function generateDbEntry(url, callback) {
    summarizer.summaryUrl(url, (err, summaryResponse) => {
        if (err) {
            console.error("Error summarizing the url!!! " + err)
            callback(err, null)
        } else {
            let savedData = {}
            savedData.meta = {}
            savedData.meta.url = url
            savedData.meta.title = summaryResponse.sm_api_title
            console.log(summaryResponse.sm_api_content)
            coreFeatureExtractor.extractCoreFeatures(summaryResponse.sm_api_content, (err, result) => {
                savedData.data = result
                dbWriter.checkAndWriteToDb(savedData, (err) => {
                    if (err) {
                        console.log("eh ?")
                        callback(err)
                    } else {
                        console.log("Successfully write the core feature to the database!")
                        callback(null)
                    }
                })
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

let urls = [
    "https://immigrationlab.org/project/the-struggle-to-integrate-muslims-in-europe/",
    "https://www.politico.eu/article/muslims-integrate-in-europe-despite-discrimination-study/",
    "http://www.inss.org.il/publication/the-challenge-of-muslim-integration-in-europe/",
    "https://www.bbvaopenmind.com/en/articles/muslims-in-europe-the-construction-of-a-problem/"
]

populateDatabase(0, urls, (err) => {
    console.log("DONE populate the database!")
})