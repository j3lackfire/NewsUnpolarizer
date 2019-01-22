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

let urls = [
    "http://www.pewforum.org/2018/10/29/eastern-and-western-europeans-differ-on-importance-of-religion-views-of-minorities-and-key-social-issues/",
    "https://www.theatlantic.com/international/archive/2019/01/bosnia-offers-model-liberal-european-islam/579529/",
    "https://dctheatrescene.com/2019/01/21/review-submission-a-dystopian-view-of-muslim-brotherhoods-takeover-of-europe/",
    "http://europa.eu/rapid/press-release_MEMO-19-542_en.htm",
    "https://eu.usatoday.com/story/money/2018/12/24/toblerone-halal-controversy-chocolate-bar-boycotted-far-right/2405914002/",
    "https://www.thetrumpet.com/18331-denmark-handshake-enforces-european-values-on-muslims",
    "https://www.thenational.ae/world/europe/british-muslim-loses-cemetery-court-battle-1.816633",
    "https://www.gatestoneinstitute.org/13490/islamic-university-europe-netherlands",
    "https://www.wsj.com/articles/europes-right-wing-woos-a-new-audience-jewish-voters-11546257601",
    "https://www.straitstimes.com/forum/letters-in-print/vital-to-stand-with-malay-muslim-community",
    "https://theconversation.com/why-do-muslim-women-wear-a-hijab-109717",
    "https://www.theamericanconservative.com/articles/the-immigrants-challenging-europes-code-of-silence-on-islam/",
    "https://blogs.timesofisrael.com/why-as-a-muslim-i-feel-holocaust-memorial-day-is-as-essential-as-ever/",
    "https://www.snopes.com/fact-check/delegation-afghanistan-familes/",
    "https://foreignpolicy.com/2019/01/05/michel-houellebecq-hated-europe-before-you-did/",
    "https://www.iol.co.za/travel/travel-news/halaal-tourism-is-on-the-rise-18891396",
    "https://www.yenisafak.com/en/world/philippines-milf-seeks-more-turkish-support-after-muslim-region-votes-3472368",
    "https://www.gatestoneinstitute.org/13543/strasbourg-capital-europe",
    "https://www.theguardian.com/cities/2019/jan/02/turkey-is-kosovo-controversy-over-balkan-states-new-central-mosque",
    "https://www.aljazeera.com/indepth/opinion/chinese-islamophobia-west-190121131831245.html",
    "https://clarionproject.org/fatality-of-western-embrace-of-political-islam/",
    "https://www.bbc.com/news/world-europe-46933236",
    "https://www.nytimes.com/2019/01/18/opinion/donald-trump-russia-putin.html",
    "https://www.nytimes.com/2019/01/21/opinion/ilhan-omar-israel-jews.html",
    "https://metro.co.uk/2019/01/22/rahaf-al-qunun-has-raised-a-major-taboo-that-some-muslims-reject-their-faith-8363479/",
    "http://www.atimes.com/article/why-the-west-wont-act-on-chinas-uighur-crisis/"
]

_getUrlsNotInDb(urls, (uniqueUrls) => {
    populateDatabase(0, uniqueUrls, (err) => {
        if (err) {

        } else {
            console.log("DONE populate the database!")
        }
    })
})

