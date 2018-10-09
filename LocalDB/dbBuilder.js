/**
 * Created by Le Pham Minh Duc on 06-Oct-18.
 */
const errorHandler = require('./../errorHandler')
const dbWriter = require('./dbWriter')
const newsApi = require('./../NewsGatherer/googleNewsAPI')
const summarizer = require('./../NewsGatherer/summarizer')

const nlpAnnotator = require('./../NLPHandler/nlpAnnotator')
const nerProcessor = require('./../NLPHandler/nerProcessor')

function summaryAllNews(newsList, callback) {
    summaryAnnotateAndSaveNews(newsList, 0, callback)
}

function summaryAnnotateAndSaveNews(newsList, currentIndex, callback) {
    //nlpAnnotator.analyzeUrl -> save to db
    console.log("summaryAnnotateAndSaveNews " + currentIndex + " , " + newsList[currentIndex].title)
    nlpAnnotator.analyzeUrl(newsList[currentIndex].url, (err, coreFeatureJson) => {
        console.log("Annotating completed")
        if (err) {
            errorHandler.logError(err, callback)
        } else {
            dbWriter.checkAndWriteToDb(coreFeatureJson, (writeToDbErr) => {
                if (writeToDbErr) {
                    errorHandler.logError(writeToDbErr, callback)
                }else {
                    console.log('The file has been saved!');
                    currentIndex ++
                    if (currentIndex >= newsList.length) {
                        callback(null)
                    } else {
                        summaryAnnotateAndSaveNews(newsList, currentIndex, callback)
                    }
                }
            })
        }
    })
}

function populateDb(callback) {
    newsApi.getTopHeadlines((newsList) => {
        if (newsList == null) {
            errorHandler.logError("Error getting the news from news API", (err) => {})
        } else {
            console.log("Summary all news")
            console.log(newsList)
            summaryAllNews(newsList, callback)
        }
    })
}

// populateDb((err) => {
//     if (!err) {
//         callback("Successfully populate the database with today news!")
//     } else {
//         callback(err)
//     }
// })

p = "In the Senate race, one of the most unexpectedly tight in the nation, any small shift among evangelical voters - long a stable base for Republicans - could be a significant loss for Mr. Cruz, who, like President Trump, has made white evangelicals the bulwark of his support. To Democrats nationwide, who have largely written off white evangelical voters, it also sends a signal - not just for the midterms but also for the 2020 presidential campaign - that there are female, religious voters who are open to some of their party's candidates. One in three Texans are evangelical, according to the Pew Research Center, and 85 percent of white evangelical voters in Texas supported Mr. Trump in 2016, higher than even the national average, which was a record high for a presidential election. The New York Times's Upshot section has been polling the race, and most public opinion polls show Mr. Cruz holding a small lead.Still, Ms. Mooney and her friends may represent an under-the-radar web of white, evangelical women in Texas whose vote in November may be more up for grabs than at any time in the recent past. The church in Texas is becoming a testing ground for the future of the evangelical voice in politics, and for evangelicals who oppose the new religious right's momentum. In Texas, since the 2016 election, black worshipers have been leaving white churches, and some white evangelical women have tiptoed away from Mr. Trump. Spending money to win over evangelical voters is not as much of a priority as trying to turn out people who voted for Ms. Clinton, says Jason Stanford, a former longtime Democrat strategist in Texas."

nerProcessor.analyzeNerFromParagraph(p, (err, annotatedResult) => {
    console.log("\n\nStffs\n\n")
    console.log(annotatedResult)
})