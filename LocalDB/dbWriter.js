/**
 * Created by Le Pham Minh Duc on 08-Apr-18.
 */
//This function will be used to populate the database with a lot of news for the function to analyze
// The url of the article
const fs = require('fs') //file system to save the file

const paragraphAnnotator = require('./../NLPHandler/annotator')
const dbReader = require('./dbReader')
const entitiesPopularity = require('./../NLPHandler/entitiesPopularity')

let baseFilePath = __dirname + '/DB/'

let dbName = dbReader.dbName
let logFileName = 'url.txt'

let articleUrls = [
    "https://www.zdnet.com/article/managing-healthcare-data-technology-standards-and-the-3-trillion-dollar-question/",
    "http://theinsidercarnews.com/2018/04/06/without-data-targeted-ads-facebook-would-look-like-a-pay/",
    "https://www.usatoday.com/story/news/politics/onpolitics/2018/04/05/ex-romney-staffer-had-woman-sign-sex-slave-contract/490522002/",
    "https://www.bloomberg.com/news/articles/2018-04-06/-it-s-becoming-childish-investors-react-as-trump-ups-the-ante",
    "http://dailycaller.com/2018/04/07/congressman-ralph-norman-handgun/",
    "https://www.wired.com/story/why-zuckerberg-15-year-apology-tour-hasnt-fixed-facebook/",
    "https://www.theguardian.com/us-news/2018/apr/07/south-carolina-republican-loaded-gun-table-constituent",
    "https://globalnews.ca/news/4129337/facebook-suspends-aggregateiq/",
    "http://www.nydailynews.com/news/politics/lawmaker-not-gabby-giffords-showing-gun-article-1.3920143",
    "http://adage.com/article/digital/facebook-officials-head-europe-respond-data-scandal/313026/",
    "http://www.nydailynews.com/news/politics/lawmaker-not-gabby-giffords-showing-gun-article-1.3920143",
    "http://fortune.com/2018/04/11/ftc-warranty-void-stickers/",
    "http://www.alphr.com/technology/1009030/warranty-void-if-removed-consumer-rights-nonsense",
    "https://www.extremetech.com/gaming/267288-ftc-warns-companies-warranty-void-if-removed-stickers-are-flatly-illegal",
    "http://www.trustedreviews.com/news/warranty-sticker-removal-ftc-void-3450128",
    "http://www.bbc.com/news/technology-43724348",
    "http://www.sportingnews.com/nba/news/jeff-hornacek-fired-knicks-coach-nba-missed-playoffs-phil-jackson-madison-square-garden/1to0jf3ow8tvc10u85gwvozoe7",
    "http://www.espn.com/nba/story/_/id/23126263/new-york-knicks-dismiss-coach-jeff-hornacek",
    "https://www.foxsports.com/nba/story/knicks-fire-coach-jeff-hornacek-after-2-seasons-041218",
    "https://nypost.com/2018/04/12/its-not-safe-to-be-a-coach-in-new-york-right-now/",
    "http://blogs.discovermagazine.com/d-brief/2018/04/11/ocean-current-climate-change-amoc/",
    "http://www.bbc.com/news/science-environment-43713719",
    "https://www.zmescience.com/ecology/climate/atlantic-ocean-circulation-04322/",
    "http://www.nonpareilonline.com/news/politics/national_government/grassley-wants-vote-next-week-on-bill-to-prevent-undue/article_f8023e42-3db7-11e8-a278-7f254d8c96ff.html",
    "http://www.chicagotribune.com/business/ct-biz-boehner-acreage-holdings-20180411-story.html",
    "http://www.kmaland.com/news/grassley-senate-committees-grill-facebook-ceo-over-data-misuse/article_c4a845f2-3da6-11e8-9120-3f7dd81ded2d.html",
    "https://www.seattletimes.com/nation-world/john-boehner-was-a-longtime-opponent-of-marijuana-reform-heres-what-changed-his-mind/",
    "https://edition.cnn.com/2018/04/12/opinions/effort-to-discredit-comey-is-fascinating-campbell/index.html",
    "https://www.independent.co.uk/news/world/middle-east/syria-civil-war-rocket-attack-damascus-dead-injured-assad-a8265896.html",
    "https://www.reuters.com/article/us-mideast-crisis-syria-damascus/scores-killed-in-rocket-attack-on-damascus-market-and-rebel-held-douma-idUSKBN1GW2I1",
    "http://www.bbc.com/news/world-middle-east-43850979",
    "https://www.channel4.com/news/factcheck/syria-chemical-attack-the-evidence",
    "https://www.nytimes.com/2018/04/19/world/middleeast/syria-strikes.html",
    "http://www.bbc.com/news/world-middle-east-39500947",
    "https://www.washingtonpost.com/world/chemical-weapons-coverup-suspected-in-syria-as-inspectors-remain-blocked/2018/04/20/1ca0f164-440a-11e8-b2dc-b0a403e4720a_story.html?noredirect=on&utm_term=.d5e5b15c1c1c",
    "https://www.nytimes.com/2018/04/11/world/middleeast/syria-chemical-attack.html"
]


// generateDB(0) //Run this command so this automatically annotate articles

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
    paragraphAnnotator.analyzeUrl(articleUrls[index], (err, res) => {
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

