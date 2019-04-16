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
    "https://immigrationlab.org/project/the-struggle-to-integrate-muslims-in-europe/",
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
    "http://www.atimes.com/article/why-the-west-wont-act-on-chinas-uighur-crisis/",
    "https://www.straitstimes.com/asia/se-asia/muslim-self-rule-backed-in-philippines-troubled-mindanao",
    "https://www.channelnewsasia.com/news/asia/philippines-law-muslim-autonomous-region-mindanao-milf-11167338",
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
    "http://koreabizwire.com/asian-tourists-favor-myeongdong-but-americans-europeans-prioritize-palaces-in-seoul-study/131272",
    "http://www.sciencemag.org/news/2019/01/surprising-reason-why-some-latin-americans-have-light-skin",
    "https://www.straitstimes.com/opinion/asias-history-lessons-for-the-worlds-future",
    "https://www.straitstimes.com/asia/east-asia/singapore-china-to-set-up-mediators-panel-for-belt-and-road-projects",
    "http://www.newindianexpress.com/opinions/2019/jan/15/did-south-asians-change-uks-destiny-1925264.html",
    "https://www.nytimes.com/2019/01/23/realestate/house-hunting-in-ecuador.html",
    "https://www.theguardian.com/uk-news/2019/jan/23/no-deal-brexit-incredibly-damaging-security-says-uk-counter-terror-head-neil-basu",
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

