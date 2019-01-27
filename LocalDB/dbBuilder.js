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
    "https://www.straitstimes.com/asia/se-asia/muslim-self-rule-backed-in-philippines-troubled-mindanao",
    "https://www.channelnewsasia.com/news/asia/philippines-law-muslim-autonomous-region-mindanao-milf-11167338",
    "https://edition.cnn.com/2019/01/25/asia/indonesia-jokowi-election-intl/index.html",
    "https://asia.nikkei.com/Economy/Indonesia-doubles-trade-missions-to-Muslim-markets-in-export-push",
    "https://www.channelnewsasia.com/news/world/bosnian-muslims-anger-serbs-with-name-change-plan--eu-calls-for-calm-11164186",
    "https://www.christianpost.com/news/pakistans-top-court-to-decide-asia-bibis-fate-as-muslim-extremists-demand-her-death.html",
    "http://muslimnews.co.uk/newspaper/world-news/34570-2/",
    "https://www.straitstimes.com/asia/se-asia/sarawak-church-wedding-with-muslim-bridesmaids",
    "https://www.straitstimes.com/asia/se-asia/chinese-indonesian-politician-reports-muslim-official-over-mandarin-campaign-remark",
    "https://asia.nikkei.com/Politics/Philippine-rebels-on-cusp-of-Muslim-autonomy-dream",
    "https://www.straitstimes.com/asia/se-asia/interracial-harmony-sarawak-church-wedding-with-muslim-bridesmaids",
    "https://www.bbc.com/news/world-asia-india-46997965",
    "https://www.straitstimes.com/asia/south-asia/angry-muslim-american-lawmaker-rashida-tlaib-shatters-stereotype-dawn-columnist",
    "https://www.weeklyblitz.net/news/turkey-exporting-radical-islam-into-south-asia-under-the-garb-of-relief/",
    "https://www.scmp.com/week-asia/society/article/2182790/muslim-teen-rahaf-mohammed-safe-canada-what-if-she-were-malaysian",
    "https://www.nybooks.com/articles/2019/02/07/reeducating-xinjiangs-muslims/",
    "https://www.straitstimes.com/asia/a-retreat-in-the-face-of-danger-the-nation",
    "https://www.bloomberg.com/news/features/2019-01-24/inside-the-vast-police-state-at-the-heart-of-china-s-belt-and-road",
    "https://kr-asia.com/the-muslim-travel-market-is-growing-but-where-are-its-unicorns",
    "https://www.aa.com.tr/en/asia-pacific/india-muslim-hindu-couples-kids-have-property-rights/1372272",
    "https://www.straitstimes.com/asia/se-asia/malay-group-wants-malaysia-declared-an-islamic-state",
    "https://www.channelnewsasia.com/news/world/central-african-soccer-executive-faces-war-crimes-judges-in-the-hague-11167822",
    "https://www.channelnewsasia.com/news/asia/indonesia-abu-bakar-bashir-early-release-cancelled-bali-bombings-11157000",
    "https://www.bbc.com/news/world-asia-46312889",
    "https://www.aa.com.tr/en/asia-pacific/india-4-convicted-in-2002-muslim-massacre-get-bail/1372208",
    "https://www.straitstimes.com/asia/bringing-you-insights-from-across-asia",
    "https://www.scmp.com/week-asia/opinion/article/2179716/asia-2019-watch-out-elections-india-and-indonesia-us-china",
    "https://www.channelnewsasia.com/news/asia/pakistan-eases-visa-rules-to--heaven-for-tourists--11166912",
    "http://www.atimes.com/how-pakistan-descended-into-poverty/",
    "http://science.sciencemag.org/content/363/6425/333",
    "https://www.the-american-interest.com/2019/01/24/u-s-strategy-towards-afghanistan-and-the-rest-of-central-asia/",
    "http://koreabizwire.com/asian-tourists-favor-myeongdong-but-americans-europeans-prioritize-palaces-in-seoul-study/131272",
    "http://www.sciencemag.org/news/2019/01/surprising-reason-why-some-latin-americans-have-light-skin",
    "https://www.straitstimes.com/opinion/asias-history-lessons-for-the-worlds-future",
    "https://www.straitstimes.com/asia/east-asia/singapore-china-to-set-up-mediators-panel-for-belt-and-road-projects",
    "http://www.newindianexpress.com/opinions/2019/jan/15/did-south-asians-change-uks-destiny-1925264.html",
    "https://www.nytimes.com/2019/01/23/realestate/house-hunting-in-ecuador.html",
    "https://moderndiplomacy.eu/2019/01/19/us-blunders-have-made-russia-the-global-trade-pivot/",
    "https://www.theguardian.com/uk-news/2019/jan/23/no-deal-brexit-incredibly-damaging-security-says-uk-counter-terror-head-neil-basu",
    "https://dailytimes.com.pk/347734/us-allies-and-us-wars/",
    "https://www.cnbc.com/2018/09/06/crazy-rich-asians-wealth-in-asia-grows-faster-than-us-europe-in-2018.html",
    "https://tmrresearchblog.com/recent-study-reveals-role-of-genetics-in-skin-color-evolution/",
    "https://www.reuters.com/article/us-autos-batteries-europe-insight/europe-up-against-asian-juggernaut-in-electric-car-battery-drive-idUSKCN1J10MF",
    "https://uk.finance.yahoo.com/news/brits-think-immigration-good-uk-000148479.html?guccounter=1",
    "https://comicbook.com/marvel/2019/01/19/spider-man-far-from-home-crazy-rich-asians-star-remy-hii-role/",
    "http://europa.eu/rapid/press-release_IP-18-6136_en.htm"
]

_getUrlsNotInDb(urls, (uniqueUrls) => {
    populateDatabase(0, uniqueUrls, (err) => {
        if (err) {

        } else {
            console.log("DONE populate the database!")
        }
    })
})

