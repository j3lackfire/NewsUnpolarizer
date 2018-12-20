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
            dbWriter.checkAndWriteToDb(res, (err_2) => {
                if (err_2) {
                    console.error("eh ?")
                    callback(err_2)
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

let urls = [
    "http://www.pewforum.org/2018/05/29/being-christian-in-western-europe/",
    "http://www.pewforum.org/2011/01/27/the-future-of-the-global-muslim-population/",
    "https://www.theatlantic.com/international/archive/2018/05/akbar-ahmed-islam-europe/559391/",
    "http://www.pewresearch.org/fact-tank/2017/11/29/5-facts-about-the-muslim-population-in-europe/",
    "https://www.haaretz.com/world-news/europe/no-europe-isn-t-returning-to-the-bosom-of-islam-1.6572926",
    "https://www.thenational.ae/world/europe/attacks-against-uk-muslims-increase-in-violence-1.797179",
    "https://www.alaraby.co.uk/english/society/2018/11/28/ambassador-of-islam-professor-akbar-ahmed",
    "https://www.dw.com/en/seehofer-tells-islam-conference-muslims-are-a-part-of-germany/a-46489983",
    "https://www.theguardian.com/world/2017/nov/29/muslim-population-in-europe-could-more-than-double",
    "https://www.aljazeera.com/programmes/specialseries/2018/08/victim-attacks-affected-muslims-europe-180801145915309.html",
    "https://www.politico.eu/article/with-anti-muslim-laws-france-denmark-europe-enters-new-dark-age/",
    "http://www.pewforum.org/2017/11/29/europes-growing-muslim-population/",
    "https://www.politico.eu/article/muslims-integrate-in-europe-despite-discrimination-study/",
    "https://immigrationlab.org/project/the-struggle-to-integrate-muslims-in-europe/"
]

_getUrlsNotInDb(urls, (uniqueUrls) => {
    populateDatabase(0, uniqueUrls, (err) => {
        if (err) {

        } else {
            console.log("DONE populate the database!")
        }
    })
})

