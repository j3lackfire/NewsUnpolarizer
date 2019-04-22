/**
 * Created by Le Pham Minh Duc on 15-Oct-18.
 */
const articlesComparer = require('./Unpolarizer/articlesComparer')
const coreFeatureExtractor = require('./NLPHandler/coreFeatureExtractor')
const nlpAnnotator = require('./NLPHandler/nlpAnnotator')
const openieProcessor = require('./NLPHandler/openieProcessor')
const sentimentProcessor = require('./NLPHandler/sentimentProcessor')
const sentimentComparer = require('./Unpolarizer/sentimentComparer')
const summarizer = require('./NewsGatherer/summarizer')
const utils = require('./utils')
const dbWriter = require('./LocalDB/dbWriter')
const dbReader = require('./LocalDB/dbReader')

let url = "https://www.straitstimes.com/asia/se-asia/interracial-harmony-sarawak-church-wedding-with-muslim-bridesmaids"

// coreFeatureExtractor.extractCoreFeaturesAndEntitiesAndMetaFromUrl(url, (err, coreFeature) => {
//     for (let i = 0; i < coreFeature.sentiment.length; i ++) {
//         console.log(coreFeature.sentiment[i].text)
//     }
//     console.log("\nSentiment count: " + coreFeature.sentiment.length)
//     console.log("\nSentence count" + coreFeature.data.length)
// })


// dbReader.readDbAsJson((error, result) => {
//     for (let i = 0; i < result.length; i ++) {
//         articlesComparer.findMostRelevanceByUrl(result[i].meta.url, (err, res) => {
//             let printVal = {}
//             printVal.meta = res[0].meta
//             printVal.entitiesPair = res[0].entitiesPair
//             utils.logFullObject(printVal)
//             console.log(",")
//         })
//     }
// })

function getInfo(annotation) {
    let returnVal = {}
    returnVal.url = annotation.meta.url
    returnVal.title = annotation.meta.title
    returnVal.sentenceLength = annotation.data.length
    returnVal.triplesNumber = 0
    returnVal.entityPairInTriple = 0
    for (let i = 0; i < annotation.data.length; i ++) {
        returnVal.triplesNumber += annotation.data[i].triplets.length
        for (let j = 0; j < annotation.data[i].triplets.length; j ++) {
            if (annotation.data[i].triplets[j].entities.length > 1) {
                returnVal.entityPairInTriple ++
            }
        }
    }
    return returnVal
}

// articlesComparer.findMostRelevanceByUrl(url, (err, res) => {
//     console.log("Most relevance article is")
//     utils.logFullObject(res[0])
// })

let a = [{
    meta:
    {
        sourceUrl: 'http://www.pewforum.org/2011/01/27/the-future-of-the-global-muslim-population/',
        sourceTitle: 'The Future of the Global Muslim Population',
        targetUrl: 'https://www.alaraby.co.uk/english/society/2018/11/28/ambassador-of-islam-professor-akbar-ahmed',
        targetTitle: '\'Ambassador of Islam\': Talking religion, immigration and identity',
        entityPairCount: 4,
        commonEntityCount: 5,
        commonStatementCount: 55
    },
    entitiesPair:
        [{
            entity_1: { text: 'Muslim', ner: 'RELIGION', positionText: 'subject' },
            entity_2: { text: 'non-Muslim', ner: 'MISC', positionText: 'object' },
            sourceSentenceIndex: 3,
            sourceTripletIndex: 6,
            targetSentenceIndex: 28,
            targetTripletIndex: 2,
            sourceStatement: 'global Muslim population is expected than non-Muslim population',
            targetStatement: 'Muslims are persecuted in non-Muslim countries'
        },
            {
                entity_1: { text: 'Muslim', ner: 'RELIGION', positionText: 'subject' },
                entity_2: { text: 'non-Muslim', ner: 'MISC', positionText: 'object' },
                sourceSentenceIndex: 3,
                sourceTripletIndex: 6,
                targetSentenceIndex: 28,
                targetTripletIndex: 3,
                sourceStatement: 'global Muslim population is expected than non-Muslim population',
                targetStatement: 'Muslims have persecuted in non-Muslim countries'
            },
            {
                entity_1: { text: 'Muslim', ner: 'RELIGION', positionText: 'subject' },
                entity_2: { text: 'non-Muslim', ner: 'MISC', positionText: 'object' },
                sourceSentenceIndex: 15,
                sourceTripletIndex: 0,
                targetSentenceIndex: 28,
                targetTripletIndex: 2,
                sourceStatement: 'Muslim populations have higher fertility rates than non-Muslim populations',
                targetStatement: 'Muslims are persecuted in non-Muslim countries'
            },
            {
                entity_1: { text: 'Muslim', ner: 'RELIGION', positionText: 'subject' },
                entity_2: { text: 'non-Muslim', ner: 'MISC', positionText: 'object' },
                sourceSentenceIndex: 15,
                sourceTripletIndex: 0,
                targetSentenceIndex: 28,
                targetTripletIndex: 3,
                sourceStatement: 'Muslim populations have higher fertility rates than non-Muslim populations',
                targetStatement: 'Muslims have persecuted in non-Muslim countries'
            }]
}
    ,
    {
        meta:
        {
            sourceUrl: 'http://www.pewresearch.org/fact-tank/2017/11/29/5-facts-about-the-muslim-population-in-europe/',
            sourceTitle: '5 facts about the Muslim population in Europe',
            targetUrl: 'http://www.pewforum.org/2017/11/29/europes-growing-muslim-population/',
            targetTitle: 'Muslim Population Growth in Europe',
            entityPairCount: 2,
            commonEntityCount: 6,
            commonStatementCount: 67
        },
        entitiesPair:
            [{
                entity_1: { text: 'Germany', ner: 'COUNTRY', positionText: 'subject' },
                entity_2: { text: 'Muslim', ner: 'RELIGION', positionText: 'object' },
                sourceSentenceIndex: 5,
                sourceTripletIndex: 0,
                targetSentenceIndex: 6,
                targetTripletIndex: 1,
                sourceStatement: 'Germany have largest Muslim populations in Europe',
                targetStatement: 'Germany accepted many Muslim refugees'
            },
                {
                    entity_1: { text: 'Germany', ner: 'COUNTRY', positionText: 'subject' },
                    entity_2: { text: 'Muslim', ner: 'RELIGION', positionText: 'object' },
                    sourceSentenceIndex: 5,
                    sourceTripletIndex: 0,
                    targetSentenceIndex: 20,
                    targetTripletIndex: 0,
                    sourceStatement: 'Germany have largest Muslim populations in Europe',
                    targetStatement: 'Germany Combining Muslim regular migrants'
                }]
    }
    ,
    {
        meta:
        {
            sourceUrl: 'http://www.pewforum.org/2018/05/29/being-christian-in-western-europe/',
            sourceTitle: 'Attitudes of Christians in Western Europe',
            targetUrl: 'https://www.gatestoneinstitute.org/13490/islamic-university-europe-netherlands',
            targetTitle: 'What is Being Taught at the "Islamic University of Europe" in the Netherlands?',
            entityPairCount: 0,
            commonEntityCount: 3,
            commonStatementCount: 22
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.theatlantic.com/international/archive/2018/05/akbar-ahmed-islam-europe/559391/',
            sourceTitle: 'How Muslim Migration Is Reshaping Europe',
            targetUrl: 'http://www.pewforum.org/2011/01/27/the-future-of-the-global-muslim-population/',
            targetTitle: 'The Future of the Global Muslim Population',
            entityPairCount: 0,
            commonEntityCount: 4,
            commonStatementCount: 43
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.haaretz.com/world-news/europe/no-europe-isn-t-returning-to-the-bosom-of-islam-1.6572926',
            sourceTitle: 'No, Europe isn\'t returning to the bosom of Islam',
            targetUrl: 'https://www.reuters.com/article/us-autos-batteries-europe-insight/europe-up-against-asian-juggernaut-in-electric-car-battery-drive-idUSKCN1J10MF',
            targetTitle: 'Europe up against Asian juggernaut in electric car battery drive',
            entityPairCount: 0,
            commonEntityCount: 5,
            commonStatementCount: 18
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.thenational.ae/world/europe/attacks-against-uk-muslims-increase-in-violence-1.797179',
            sourceTitle: 'Attacks against UK Muslims increase in violence',
            targetUrl: 'https://www.alaraby.co.uk/english/society/2018/11/28/ambassador-of-islam-professor-akbar-ahmed',
            targetTitle: '\'Ambassador of Islam\': Talking religion, immigration and identity',
            entityPairCount: 0,
            commonEntityCount: 4,
            commonStatementCount: 17
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.dw.com/en/seehofer-tells-islam-conference-muslims-are-a-part-of-germany/a-46489983',
            sourceTitle: 'Seehofer tells Islam conference Muslims are a part of Germany',
            targetUrl: 'https://www.thetrumpet.com/18331-denmark-handshake-enforces-european-values-on-muslims',
            targetTitle: 'Denmark Handshake Enforces European Values on Muslims',
            entityPairCount: 0,
            commonEntityCount: 2,
            commonStatementCount: 6
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.alaraby.co.uk/english/society/2018/11/28/ambassador-of-islam-professor-akbar-ahmed',
            sourceTitle: '\'Ambassador of Islam\': Talking religion, immigration and identity',
            targetUrl: 'http://www.pewforum.org/2011/01/27/the-future-of-the-global-muslim-population/',
            targetTitle: 'The Future of the Global Muslim Population',
            entityPairCount: 4,
            commonEntityCount: 5,
            commonStatementCount: 55
        },
        entitiesPair:
            [{
                entity_1: { text: 'Muslim', ner: 'RELIGION', positionText: 'subject' },
                entity_2: { text: 'non-Muslim', ner: 'MISC', positionText: 'object' },
                sourceSentenceIndex: 28,
                sourceTripletIndex: 2,
                targetSentenceIndex: 3,
                targetTripletIndex: 6,
                sourceStatement: 'Muslims are persecuted in non-Muslim countries',
                targetStatement: 'global Muslim population is expected than non-Muslim population'
            },
                {
                    entity_1: { text: 'Muslim', ner: 'RELIGION', positionText: 'subject' },
                    entity_2: { text: 'non-Muslim', ner: 'MISC', positionText: 'object' },
                    sourceSentenceIndex: 28,
                    sourceTripletIndex: 2,
                    targetSentenceIndex: 15,
                    targetTripletIndex: 0,
                    sourceStatement: 'Muslims are persecuted in non-Muslim countries',
                    targetStatement: 'Muslim populations have higher fertility rates than non-Muslim populations'
                },
                {
                    entity_1: { text: 'Muslim', ner: 'RELIGION', positionText: 'subject' },
                    entity_2: { text: 'non-Muslim', ner: 'MISC', positionText: 'object' },
                    sourceSentenceIndex: 28,
                    sourceTripletIndex: 3,
                    targetSentenceIndex: 3,
                    targetTripletIndex: 6,
                    sourceStatement: 'Muslims have persecuted in non-Muslim countries',
                    targetStatement: 'global Muslim population is expected than non-Muslim population'
                },
                {
                    entity_1: { text: 'Muslim', ner: 'RELIGION', positionText: 'subject' },
                    entity_2: { text: 'non-Muslim', ner: 'MISC', positionText: 'object' },
                    sourceSentenceIndex: 28,
                    sourceTripletIndex: 3,
                    targetSentenceIndex: 15,
                    targetTripletIndex: 0,
                    sourceStatement: 'Muslims have persecuted in non-Muslim countries',
                    targetStatement: 'Muslim populations have higher fertility rates than non-Muslim populations'
                }]
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.theguardian.com/world/2017/nov/29/muslim-population-in-europe-could-more-than-double',
            sourceTitle: 'Muslim population in some EU countries could triple, says report',
            targetUrl: 'http://www.pewforum.org/2017/11/29/europes-growing-muslim-population/',
            targetTitle: 'Muslim Population Growth in Europe',
            entityPairCount: 1,
            commonEntityCount: 8,
            commonStatementCount: 71
        },
        entitiesPair:
            [{
                entity_1: { text: 'Europe', ner: 'LOCATION', positionText: 'object' },
                entity_2: { text: 'France', ner: 'COUNTRY', positionText: 'subject' },
                sourceSentenceIndex: 8,
                sourceTripletIndex: 0,
                targetSentenceIndex: 22,
                targetTripletIndex: 8,
                sourceStatement: 'France Apart would have Europe \'s biggest share of population with 12.7 % up from 8.8 %',
                targetStatement: 'France received migrants to Europe'
            }]
    }
    ,
    {
        meta:
        {
            sourceUrl: 'http://www.pewforum.org/2017/11/29/europes-growing-muslim-population/',
            sourceTitle: 'Muslim Population Growth in Europe',
            targetUrl: 'http://www.pewresearch.org/fact-tank/2017/11/29/5-facts-about-the-muslim-population-in-europe/',
            targetTitle: '5 facts about the Muslim population in Europe',
            entityPairCount: 2,
            commonEntityCount: 6,
            commonStatementCount: 67
        },
        entitiesPair:
            [{
                entity_1: { text: 'Germany', ner: 'COUNTRY', positionText: 'subject' },
                entity_2: { text: 'Muslim', ner: 'RELIGION', positionText: 'object' },
                sourceSentenceIndex: 6,
                sourceTripletIndex: 1,
                targetSentenceIndex: 5,
                targetTripletIndex: 0,
                sourceStatement: 'Germany accepted many Muslim refugees',
                targetStatement: 'Germany have largest Muslim populations in Europe'
            },
                {
                    entity_1: { text: 'Germany', ner: 'COUNTRY', positionText: 'subject' },
                    entity_2: { text: 'Muslim', ner: 'RELIGION', positionText: 'object' },
                    sourceSentenceIndex: 20,
                    sourceTripletIndex: 0,
                    targetSentenceIndex: 5,
                    targetTripletIndex: 0,
                    sourceStatement: 'Germany Combining Muslim regular migrants',
                    targetStatement: 'Germany have largest Muslim populations in Europe'
                }]
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.politico.eu/article/with-anti-muslim-laws-france-denmark-europe-enters-new-dark-age/',
            sourceTitle: 'With anti-Muslim laws, Europe enters new dark age – POLITICO',
            targetUrl: 'https://www.wsj.com/articles/europes-right-wing-woos-a-new-audience-jewish-voters-11546257601',
            targetTitle: 'Europe\'s Right Wing Woos a New Audience: Jewish Voters',
            entityPairCount: 0,
            commonEntityCount: 7,
            commonStatementCount: 27
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.aljazeera.com/programmes/specialseries/2018/08/victim-attacks-affected-muslims-europe-180801145915309.html',
            sourceTitle: 'Twice a Victim: How Have Attacks Affected Muslims in Europe?',
            targetUrl: 'http://www.pewforum.org/2017/11/29/europes-growing-muslim-population/',
            targetTitle: 'Muslim Population Growth in Europe',
            entityPairCount: 0,
            commonEntityCount: 4,
            commonStatementCount: 23
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'http://www.pewforum.org/2018/10/29/eastern-and-western-europeans-differ-on-importance-of-religion-views-of-minorities-and-key-social-issues/',
            sourceTitle: 'Eastern and Western Europeans Differ on Importance of Religion, Views of Minorities, and Key Social Issues',
            targetUrl: 'http://europa.eu/rapid/press-release_MEMO-19-542_en.htm',
            targetTitle: 'Eurobarometer survey on Antisemitism in Europe',
            entityPairCount: 0,
            commonEntityCount: 5,
            commonStatementCount: 20
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://immigrationlab.org/project/the-struggle-to-integrate-muslims-in-europe/',
            sourceTitle: 'The Struggle to Integrate Muslims in Europe',
            targetUrl: 'https://www.thetrumpet.com/18331-denmark-handshake-enforces-european-values-on-muslims',
            targetTitle: 'Denmark Handshake Enforces European Values on Muslims',
            entityPairCount: 0,
            commonEntityCount: 6,
            commonStatementCount: 33
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.theatlantic.com/international/archive/2019/01/bosnia-offers-model-liberal-european-islam/579529/',
            sourceTitle: 'Bosnia Offers a Model of Liberal European Islam',
            targetUrl: 'https://www.gatestoneinstitute.org/13490/islamic-university-europe-netherlands',
            targetTitle: 'What is Being Taught at the "Islamic University of Europe" in the Netherlands?',
            entityPairCount: 0,
            commonEntityCount: 5,
            commonStatementCount: 14
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://eu.usatoday.com/story/money/2018/12/24/toblerone-halal-controversy-chocolate-bar-boycotted-far-right/2405914002/',
            sourceTitle: 'Toblerone halal controversy: Chocolate boycotted by Europe\'s far-right',
            targetUrl: 'https://www.straitstimes.com/asia/south-asia/angry-muslim-american-lawmaker-rashida-tlaib-shatters-stereotype-dawn-columnist',
            targetTitle: 'Angry, Muslim-American lawmaker Rashida Tlaib shatters stereotype: Dawn columnist, South Asia News & Top Stories',
            entityPairCount: 0,
            commonEntityCount: 2,
            commonStatementCount: 8
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://dctheatrescene.com/2019/01/21/review-submission-a-dystopian-view-of-muslim-brotherhoods-takeover-of-europe/',
            sourceTitle: 'Review: Submission, a dystopian view of Muslim Brotherhood\'s takeover of Europe',
            targetUrl: 'https://foreignpolicy.com/2019/01/05/michel-houellebecq-hated-europe-before-you-did/',
            targetTitle: 'Michel Houellebecq Hated Europe Before You Did – Foreign Policy',
            entityPairCount: 0,
            commonEntityCount: 4,
            commonStatementCount: 13
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.gatestoneinstitute.org/13490/islamic-university-europe-netherlands',
            sourceTitle: 'What is Being Taught at the "Islamic University of Europe" in the Netherlands?',
            targetUrl: 'https://www.theatlantic.com/international/archive/2019/01/bosnia-offers-model-liberal-european-islam/579529/',
            targetTitle: 'Bosnia Offers a Model of Liberal European Islam',
            entityPairCount: 0,
            commonEntityCount: 5,
            commonStatementCount: 14
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.thenational.ae/world/europe/british-muslim-loses-cemetery-court-battle-1.816633',
            sourceTitle: 'British Muslim loses cemetery court battle',
            targetUrl: 'http://www.newindianexpress.com/opinions/2019/jan/15/did-south-asians-change-uks-destiny-1925264.html',
            targetTitle: 'Did south Asians change UK\'s destiny?- The New Indian Express',
            entityPairCount: 0,
            commonEntityCount: 1,
            commonStatementCount: 6
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.wsj.com/articles/europes-right-wing-woos-a-new-audience-jewish-voters-11546257601',
            sourceTitle: 'Europe\'s Right Wing Woos a New Audience: Jewish Voters',
            targetUrl: 'https://www.politico.eu/article/with-anti-muslim-laws-france-denmark-europe-enters-new-dark-age/',
            targetTitle: 'With anti-Muslim laws, Europe enters new dark age – POLITICO',
            entityPairCount: 0,
            commonEntityCount: 7,
            commonStatementCount: 27
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.thetrumpet.com/18331-denmark-handshake-enforces-european-values-on-muslims',
            sourceTitle: 'Denmark Handshake Enforces European Values on Muslims',
            targetUrl: 'https://immigrationlab.org/project/the-struggle-to-integrate-muslims-in-europe/',
            targetTitle: 'The Struggle to Integrate Muslims in Europe',
            entityPairCount: 0,
            commonEntityCount: 6,
            commonStatementCount: 33
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.straitstimes.com/forum/letters-in-print/vital-to-stand-with-malay-muslim-community',
            sourceTitle: 'Vital to stand with Malay-Muslim community, Letters in Print News & Top Stories',
            targetUrl: 'https://www.straitstimes.com/opinion/asias-history-lessons-for-the-worlds-future',
            targetTitle: 'Asia\'s history lessons for the world\'s future, Opinion News & Top Stories',
            entityPairCount: 0,
            commonEntityCount: 3,
            commonStatementCount: 7
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://theconversation.com/why-do-muslim-women-wear-a-hijab-109717',
            sourceTitle: 'Why do Muslim women wear a hijab?',
            targetUrl: 'https://www.theatlantic.com/international/archive/2018/05/akbar-ahmed-islam-europe/559391/',
            targetTitle: 'How Muslim Migration Is Reshaping Europe',
            entityPairCount: 0,
            commonEntityCount: 4,
            commonStatementCount: 17
        },
        entitiesPair: []
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.theamericanconservative.com/articles/the-immigrants-challenging-europes-code-of-silence-on-islam/',
            sourceTitle: 'The Immigrants Challenging Europe\'s Code of Silence on Islam',
            targetUrl: 'https://www.thetrumpet.com/18331-denmark-handshake-enforces-european-values-on-muslims',
            targetTitle: 'Denmark Handshake Enforces European Values on Muslims',
            entityPairCount: 0,
            commonEntityCount: 5,
            commonStatementCount: 18
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'http://europa.eu/rapid/press-release_MEMO-19-542_en.htm',
            sourceTitle: 'Eurobarometer survey on Antisemitism in Europe',
            targetUrl: 'http://europa.eu/rapid/press-release_IP-18-6136_en.htm',
            targetTitle: 'Global Partners for Global Challenges',
            entityPairCount: 0,
            commonEntityCount: 6,
            commonStatementCount: 30
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.politico.eu/article/muslims-integrate-in-europe-despite-discrimination-study/',
            sourceTitle: 'Muslims integrate in Europe despite discrimination: study – POLITICO',
            targetUrl: 'http://www.pewforum.org/2017/11/29/europes-growing-muslim-population/',
            targetTitle: 'Muslim Population Growth in Europe',
            entityPairCount: 0,
            commonEntityCount: 3,
            commonStatementCount: 37
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://foreignpolicy.com/2019/01/05/michel-houellebecq-hated-europe-before-you-did/',
            sourceTitle: 'Michel Houellebecq Hated Europe Before You Did – Foreign Policy',
            targetUrl: 'https://immigrationlab.org/project/the-struggle-to-integrate-muslims-in-europe/',
            targetTitle: 'The Struggle to Integrate Muslims in Europe',
            entityPairCount: 0,
            commonEntityCount: 5,
            commonStatementCount: 25
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://blogs.timesofisrael.com/why-as-a-muslim-i-feel-holocaust-memorial-day-is-as-essential-as-ever/',
            sourceTitle: 'Why as a Muslim, I feel Holocaust Memorial Day is as essential as ever',
            targetUrl: 'https://www.straitstimes.com/asia/a-retreat-in-the-face-of-danger-the-nation',
            targetTitle: 'A retreat in the face of danger: The Nation, Asia News & Top Stories',
            entityPairCount: 0,
            commonEntityCount: 2,
            commonStatementCount: 6
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.theguardian.com/cities/2019/jan/02/turkey-is-kosovo-controversy-over-balkan-states-new-central-mosque',
            sourceTitle: 'Turkey\'s gift of a mosque sparks fears of \'neo-Ottomanism\' in Kosovo',
            targetUrl: 'https://www.weeklyblitz.net/news/turkey-exporting-radical-islam-into-south-asia-under-the-garb-of-relief/',
            targetTitle: 'Turkey exporting radical Islam into South Asia under the garb of relief',
            entityPairCount: 0,
            commonEntityCount: 3,
            commonStatementCount: 17
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.iol.co.za/travel/travel-news/halaal-tourism-is-on-the-rise-18891396',
            sourceTitle: '',
            targetUrl: 'https://www.alaraby.co.uk/english/society/2018/11/28/ambassador-of-islam-professor-akbar-ahmed',
            targetTitle: '\'Ambassador of Islam\': Talking religion, immigration and identity',
            entityPairCount: 0,
            commonEntityCount: 3,
            commonStatementCount: 13
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.yenisafak.com/en/world/philippines-milf-seeks-more-turkish-support-after-muslim-region-votes-3472368',
            sourceTitle: 'Philippines\' MILF seeks more Turkish support after Muslim region votes',
            targetUrl: 'https://asia.nikkei.com/Politics/Philippine-rebels-on-cusp-of-Muslim-autonomy-dream',
            targetTitle: 'Philippine rebels on cusp of Muslim autonomy dream',
            entityPairCount: 0,
            commonEntityCount: 4,
            commonStatementCount: 19
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.gatestoneinstitute.org/13543/strasbourg-capital-europe',
            sourceTitle: 'Strasbourg: Capital of the EU and "The Future of Europe"',
            targetUrl: 'https://www.weeklyblitz.net/news/turkey-exporting-radical-islam-into-south-asia-under-the-garb-of-relief/',
            targetTitle: 'Turkey exporting radical Islam into South Asia under the garb of relief',
            entityPairCount: 0,
            commonEntityCount: 3,
            commonStatementCount: 14
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.aljazeera.com/indepth/opinion/chinese-islamophobia-west-190121131831245.html',
            sourceTitle: 'Chinese Islamophobia was made in the West',
            targetUrl: 'http://www.atimes.com/article/why-the-west-wont-act-on-chinas-uighur-crisis/',
            targetTitle: 'Why the West won\'t act on China\'s Uighur crisis',
            entityPairCount: 0,
            commonEntityCount: 6,
            commonStatementCount: 23
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://clarionproject.org/fatality-of-western-embrace-of-political-islam/',
            sourceTitle: 'Fatality of Western Embrace of Political Islam',
            targetUrl: 'https://www.nybooks.com/articles/2019/02/07/reeducating-xinjiangs-muslims/',
            targetTitle: '\'Reeducating\' Xinjiang\'s Muslims',
            entityPairCount: 0,
            commonEntityCount: 2,
            commonStatementCount: 7
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.nytimes.com/2019/01/18/opinion/donald-trump-russia-putin.html',
            sourceTitle: '',
            targetUrl: 'http://europa.eu/rapid/press-release_IP-18-6136_en.htm',
            targetTitle: 'Global Partners for Global Challenges',
            entityPairCount: 0,
            commonEntityCount: 3,
            commonStatementCount: 18
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://metro.co.uk/2019/01/22/rahaf-al-qunun-has-raised-a-major-taboo-that-some-muslims-reject-their-faith-8363479/',
            sourceTitle: 'Rahaf al-Qunun has raised a major taboo: that some Muslims reject their faith',
            targetUrl: 'https://www.thetrumpet.com/18331-denmark-handshake-enforces-european-values-on-muslims',
            targetTitle: 'Denmark Handshake Enforces European Values on Muslims',
            entityPairCount: 0,
            commonEntityCount: 4,
            commonStatementCount: 19
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.bbc.com/news/world-europe-46933236',
            sourceTitle: '#10YearChallenge; Turkey puts spotlight on the headscarf',
            targetUrl: 'https://www.wsj.com/articles/europes-right-wing-woos-a-new-audience-jewish-voters-11546257601',
            targetTitle: 'Europe\'s Right Wing Woos a New Audience: Jewish Voters',
            entityPairCount: 0,
            commonEntityCount: 1,
            commonStatementCount: 3
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.straitstimes.com/asia/se-asia/muslim-self-rule-backed-in-philippines-troubled-mindanao',
            sourceTitle: 'Muslim self-rule backed in Philippines\' troubled Mindanao, SE Asia News & Top Stories',
            targetUrl: 'https://asia.nikkei.com/Politics/Philippine-rebels-on-cusp-of-Muslim-autonomy-dream',
            targetTitle: 'Philippine rebels on cusp of Muslim autonomy dream',
            entityPairCount: 0,
            commonEntityCount: 6,
            commonStatementCount: 26
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.christianpost.com/news/pakistans-top-court-to-decide-asia-bibis-fate-as-muslim-extremists-demand-her-death.html',
            sourceTitle: 'Pakistan\'s top court to decide Asia Bibi\'s fate as Muslim extremists demand her death',
            targetUrl: 'http://www.atimes.com/how-pakistan-descended-into-poverty/',
            targetTitle: 'How Pakistan descended into poverty',
            entityPairCount: 0,
            commonEntityCount: 4,
            commonStatementCount: 28
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.channelnewsasia.com/news/world/bosnian-muslims-anger-serbs-with-name-change-plan--eu-calls-for-calm-11164186',
            sourceTitle: 'Bosnian Muslims anger Serbs with name change plan, EU calls for calm',
            targetUrl: 'https://www.theatlantic.com/international/archive/2019/01/bosnia-offers-model-liberal-european-islam/579529/',
            targetTitle: 'Bosnia Offers a Model of Liberal European Islam',
            entityPairCount: 0,
            commonEntityCount: 2,
            commonStatementCount: 5
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://asia.nikkei.com/Economy/Indonesia-doubles-trade-missions-to-Muslim-markets-in-export-push',
            sourceTitle: 'Indonesia doubles trade missions to Muslim markets in export push',
            targetUrl: 'https://www.scmp.com/week-asia/opinion/article/2179716/asia-2019-watch-out-elections-india-and-indonesia-us-china',
            targetTitle: 'Asia in 2019: from elections in India and Indonesia to US-China tensions, Xinjiang and extreme weather',
            entityPairCount: 0,
            commonEntityCount: 5,
            commonStatementCount: 16
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.straitstimes.com/asia/se-asia/interracial-harmony-sarawak-church-wedding-with-muslim-bridesmaids',
            sourceTitle: 'Interracial harmony: Sarawak church wedding with Muslim bridesmaids, SE Asia News & Top Stories',
            targetUrl: 'https://www.straitstimes.com/asia/se-asia/sarawak-church-wedding-with-muslim-bridesmaids',
            targetTitle: 'Sarawak church wedding with Muslim bridesmaids, SE Asia News & Top Stories',
            entityPairCount: 2,
            commonEntityCount: 5,
            commonStatementCount: 10
        },
        entitiesPair:
            [{
                entity_1:
                {
                    text: 'Sylvester Voon',
                    ner: 'PERSON',
                    positionText: 'subject'
                },
                entity_2:
                {
                    text: 'St Joseph',
                    ner: 'ORGANIZATION',
                    positionText: 'object'
                },
                sourceSentenceIndex: 1,
                sourceTripletIndex: 0,
                targetSentenceIndex: 1,
                targetTripletIndex: 0,
                sourceStatement: 'Sarawakian couple Sylvester Voon getting married at St Joseph \'s Cathedral in Kuching',
                targetStatement: 'Sarawakian couple Sylvester Voon getting married at St Joseph \'s Cathedral in state capital Kuching'
            },
                {
                    entity_1:
                    {
                        text: 'Sylvester Voon',
                        ner: 'PERSON',
                        positionText: 'subject'
                    },
                    entity_2: { text: 'Kuching', ner: 'CITY', positionText: 'object' },
                    sourceSentenceIndex: 1,
                    sourceTripletIndex: 0,
                    targetSentenceIndex: 1,
                    targetTripletIndex: 0,
                    sourceStatement: 'Sarawakian couple Sylvester Voon getting married at St Joseph \'s Cathedral in Kuching',
                    targetStatement: 'Sarawakian couple Sylvester Voon getting married at St Joseph \'s Cathedral in state capital Kuching'
                }]
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.channelnewsasia.com/news/asia/philippines-law-muslim-autonomous-region-mindanao-milf-11167338',
            sourceTitle: 'Landmark law ratified, paving way for Muslim autonomous region in southern Philippines',
            targetUrl: 'https://www.straitstimes.com/asia/se-asia/muslim-self-rule-backed-in-philippines-troubled-mindanao',
            targetTitle: 'Muslim self-rule backed in Philippines\' troubled Mindanao, SE Asia News & Top Stories',
            entityPairCount: 0,
            commonEntityCount: 5,
            commonStatementCount: 24
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.straitstimes.com/asia/se-asia/sarawak-church-wedding-with-muslim-bridesmaids',
            sourceTitle: 'Sarawak church wedding with Muslim bridesmaids, SE Asia News & Top Stories',
            targetUrl: 'https://www.straitstimes.com/asia/se-asia/interracial-harmony-sarawak-church-wedding-with-muslim-bridesmaids',
            targetTitle: 'Interracial harmony: Sarawak church wedding with Muslim bridesmaids, SE Asia News & Top Stories',
            entityPairCount: 2,
            commonEntityCount: 5,
            commonStatementCount: 10
        },
        entitiesPair:
            [{
                entity_1:
                {
                    text: 'Sylvester Voon',
                    ner: 'PERSON',
                    positionText: 'subject'
                },
                entity_2:
                {
                    text: 'St Joseph',
                    ner: 'ORGANIZATION',
                    positionText: 'object'
                },
                sourceSentenceIndex: 1,
                sourceTripletIndex: 0,
                targetSentenceIndex: 1,
                targetTripletIndex: 0,
                sourceStatement: 'Sarawakian couple Sylvester Voon getting married at St Joseph \'s Cathedral in state capital Kuching',
                targetStatement: 'Sarawakian couple Sylvester Voon getting married at St Joseph \'s Cathedral in Kuching'
            },
                {
                    entity_1:
                    {
                        text: 'Sylvester Voon',
                        ner: 'PERSON',
                        positionText: 'subject'
                    },
                    entity_2: { text: 'Kuching', ner: 'CITY', positionText: 'object' },
                    sourceSentenceIndex: 1,
                    sourceTripletIndex: 0,
                    targetSentenceIndex: 1,
                    targetTripletIndex: 0,
                    sourceStatement: 'Sarawakian couple Sylvester Voon getting married at St Joseph \'s Cathedral in state capital Kuching',
                    targetStatement: 'Sarawakian couple Sylvester Voon getting married at St Joseph \'s Cathedral in Kuching'
                }]
    }
    ,
    {
        meta:
        {
            sourceUrl: 'http://muslimnews.co.uk/newspaper/world-news/34570-2/',
            sourceTitle: 'Three Hui mosques raided in China\'s Yunnan province',
            targetUrl: 'https://foreignpolicy.com/2018/11/28/china-is-violating-uighurs-human-rights-the-united-states-must-act/',
            targetTitle: 'China Is Violating Uighurs\' Human Rights. The United States Must Act. – Foreign Policy',
            entityPairCount: 0,
            commonEntityCount: 4,
            commonStatementCount: 14
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'http://www.atimes.com/article/why-the-west-wont-act-on-chinas-uighur-crisis/',
            sourceTitle: 'Why the West won\'t act on China\'s Uighur crisis',
            targetUrl: 'https://foreignpolicy.com/2018/11/28/china-is-violating-uighurs-human-rights-the-united-states-must-act/',
            targetTitle: 'China Is Violating Uighurs\' Human Rights. The United States Must Act. – Foreign Policy',
            entityPairCount: 0,
            commonEntityCount: 9,
            commonStatementCount: 39
        },
        entitiesPair: []
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://asia.nikkei.com/Politics/Philippine-rebels-on-cusp-of-Muslim-autonomy-dream',
            sourceTitle: 'Philippine rebels on cusp of Muslim autonomy dream',
            targetUrl: 'https://www.straitstimes.com/asia/se-asia/muslim-self-rule-backed-in-philippines-troubled-mindanao',
            targetTitle: 'Muslim self-rule backed in Philippines\' troubled Mindanao, SE Asia News & Top Stories',
            entityPairCount: 0,
            commonEntityCount: 6,
            commonStatementCount: 26
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.scmp.com/week-asia/society/article/2182790/muslim-teen-rahaf-mohammed-safe-canada-what-if-she-were-malaysian',
            sourceTitle: 'Muslim teen Rahaf Mohammed is safe in Canada. What if she were Malaysian or Indonesian?',
            targetUrl: 'http://www.pewforum.org/2011/01/27/the-future-of-the-global-muslim-population/',
            targetTitle: 'The Future of the Global Muslim Population',
            entityPairCount: 0,
            commonEntityCount: 4,
            commonStatementCount: 42
        },
        entitiesPair: []
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.nytimes.com/2019/01/21/opinion/ilhan-omar-israel-jews.html',
            sourceTitle: '',
            targetUrl: 'https://www.wsj.com/articles/europes-right-wing-woos-a-new-audience-jewish-voters-11546257601',
            targetTitle: 'Europe\'s Right Wing Woos a New Audience: Jewish Voters',
            entityPairCount: 0,
            commonEntityCount: 3,
            commonStatementCount: 15
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.bbc.com/news/world-asia-india-46997965',
            sourceTitle: 'Assam citizenship bill: Anti-migrant protests rock north-east India',
            targetUrl: 'http://www.atimes.com/how-pakistan-descended-into-poverty/',
            targetTitle: 'How Pakistan descended into poverty',
            entityPairCount: 0,
            commonEntityCount: 3,
            commonStatementCount: 18
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.straitstimes.com/asia/se-asia/chinese-indonesian-politician-reports-muslim-official-over-mandarin-campaign-remark',
            sourceTitle: 'Chinese-Indonesian politician reports Muslim official over Mandarin campaign remark, SE Asia News & Top Stories',
            targetUrl: 'https://www.nybooks.com/articles/2019/02/07/reeducating-xinjiangs-muslims/',
            targetTitle: '\'Reeducating\' Xinjiang\'s Muslims',
            entityPairCount: 0,
            commonEntityCount: 1,
            commonStatementCount: 5
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.straitstimes.com/asia/a-retreat-in-the-face-of-danger-the-nation',
            sourceTitle: 'A retreat in the face of danger: The Nation, Asia News & Top Stories',
            targetUrl: 'https://kr-asia.com/the-muslim-travel-market-is-growing-but-where-are-its-unicorns',
            targetTitle: 'The Muslim travel market is growing, but where are its unicorns?',
            entityPairCount: 0,
            commonEntityCount: 2,
            commonStatementCount: 8
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.aa.com.tr/en/asia-pacific/india-muslim-hindu-couples-kids-have-property-rights/1372272',
            sourceTitle: 'India: Muslim-Hindu couples\' kids have property rights',
            targetUrl: 'http://www.pewforum.org/2017/11/29/europes-growing-muslim-population/',
            targetTitle: 'Muslim Population Growth in Europe',
            entityPairCount: 0,
            commonEntityCount: 2,
            commonStatementCount: 13
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://kr-asia.com/the-muslim-travel-market-is-growing-but-where-are-its-unicorns',
            sourceTitle: 'The Muslim travel market is growing, but where are its unicorns?',
            targetUrl: 'https://asia.nikkei.com/Economy/Indonesia-doubles-trade-missions-to-Muslim-markets-in-export-push',
            targetTitle: 'Indonesia doubles trade missions to Muslim markets in export push',
            entityPairCount: 0,
            commonEntityCount: 3,
            commonStatementCount: 23
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.straitstimes.com/asia/se-asia/malay-group-wants-malaysia-declared-an-islamic-state',
            sourceTitle: 'Malay group Ikatan Muslimin Malaysia wants Malaysia declared an \'Islamic state\', SE Asia News & Top Stories',
            targetUrl: 'https://www.theatlantic.com/international/archive/2019/01/bosnia-offers-model-liberal-european-islam/579529/',
            targetTitle: 'Bosnia Offers a Model of Liberal European Islam',
            entityPairCount: 0,
            commonEntityCount: 3,
            commonStatementCount: 8
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.nybooks.com/articles/2019/02/07/reeducating-xinjiangs-muslims/',
            sourceTitle: '\'Reeducating\' Xinjiang\'s Muslims',
            targetUrl: 'https://foreignpolicy.com/2018/11/28/china-is-violating-uighurs-human-rights-the-united-states-must-act/',
            targetTitle: 'China Is Violating Uighurs\' Human Rights. The United States Must Act. – Foreign Policy',
            entityPairCount: 0,
            commonEntityCount: 6,
            commonStatementCount: 35
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.channelnewsasia.com/news/world/central-african-soccer-executive-faces-war-crimes-judges-in-the-hague-11167822',
            sourceTitle: 'Central African soccer executive faces war crimes judges in The Hague',
            targetUrl: 'https://foreignpolicy.com/2019/01/05/michel-houellebecq-hated-europe-before-you-did/',
            targetTitle: 'Michel Houellebecq Hated Europe Before You Did – Foreign Policy',
            entityPairCount: 0,
            commonEntityCount: 2,
            commonStatementCount: 8
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.straitstimes.com/asia/bringing-you-insights-from-across-asia',
            sourceTitle: 'Bringing you insights from across Asia, Asia News & Top Stories',
            targetUrl: 'https://www.scmp.com/week-asia/opinion/article/2179716/asia-2019-watch-out-elections-india-and-indonesia-us-china',
            targetTitle: 'Asia in 2019: from elections in India and Indonesia to US-China tensions, Xinjiang and extreme weather',
            entityPairCount: 0,
            commonEntityCount: 4,
            commonStatementCount: 11
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.bbc.com/news/world-asia-46312889',
            sourceTitle: 'What awaits any Rohingya refugees who return to Myanmar?',
            targetUrl: 'https://www.straitstimes.com/asia/a-retreat-in-the-face-of-danger-the-nation',
            targetTitle: 'A retreat in the face of danger: The Nation, Asia News & Top Stories',
            entityPairCount: 0,
            commonEntityCount: 2,
            commonStatementCount: 6
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.channelnewsasia.com/news/asia/pakistan-eases-visa-rules-to--heaven-for-tourists--11166912',
            sourceTitle: 'Pakistan eases visa rules to \'heaven for tourists\'',
            targetUrl: 'https://asia.nikkei.com/Economy/Indonesia-doubles-trade-missions-to-Muslim-markets-in-export-push',
            targetTitle: 'Indonesia doubles trade missions to Muslim markets in export push',
            entityPairCount: 0,
            commonEntityCount: 3,
            commonStatementCount: 9
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.scmp.com/week-asia/opinion/article/2179716/asia-2019-watch-out-elections-india-and-indonesia-us-china',
            sourceTitle: 'Asia in 2019: from elections in India and Indonesia to US-China tensions, Xinjiang and extreme weather',
            targetUrl: 'https://www.straitstimes.com/opinion/asias-history-lessons-for-the-worlds-future',
            targetTitle: 'Asia\'s history lessons for the world\'s future, Opinion News & Top Stories',
            entityPairCount: 0,
            commonEntityCount: 5,
            commonStatementCount: 50
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.aa.com.tr/en/asia-pacific/india-4-convicted-in-2002-muslim-massacre-get-bail/1372208',
            sourceTitle: 'India: 4 convicted in 2002 Muslim massacre get bail',
            targetUrl: 'http://www.pewforum.org/2011/01/27/the-future-of-the-global-muslim-population/',
            targetTitle: 'The Future of the Global Muslim Population',
            entityPairCount: 0,
            commonEntityCount: 2,
            commonStatementCount: 10
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.straitstimes.com/asia/south-asia/angry-muslim-american-lawmaker-rashida-tlaib-shatters-stereotype-dawn-columnist',
            sourceTitle: 'Angry, Muslim-American lawmaker Rashida Tlaib shatters stereotype: Dawn columnist, South Asia News & Top Stories',
            targetUrl: 'http://www.pewforum.org/2011/01/27/the-future-of-the-global-muslim-population/',
            targetTitle: 'The Future of the Global Muslim Population',
            entityPairCount: 0,
            commonEntityCount: 4,
            commonStatementCount: 42
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'http://www.sciencemag.org/news/2019/01/surprising-reason-why-some-latin-americans-have-light-skin',
            sourceTitle: 'The surprising reason why some Latin Americans have light skin',
            targetUrl: 'https://tmrresearchblog.com/recent-study-reveals-role-of-genetics-in-skin-color-evolution/',
            targetTitle: 'Recent Study Reveals Role of Genetics in Skin Color Evolution',
            entityPairCount: 0,
            commonEntityCount: 6,
            commonStatementCount: 24
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'http://www.atimes.com/how-pakistan-descended-into-poverty/',
            sourceTitle: 'How Pakistan descended into poverty',
            targetUrl: 'https://www.christianpost.com/news/pakistans-top-court-to-decide-asia-bibis-fate-as-muslim-extremists-demand-her-death.html',
            targetTitle: 'Pakistan\'s top court to decide Asia Bibi\'s fate as Muslim extremists demand her death',
            entityPairCount: 0,
            commonEntityCount: 4,
            commonStatementCount: 28
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.straitstimes.com/opinion/asias-history-lessons-for-the-worlds-future',
            sourceTitle: 'Asia\'s history lessons for the world\'s future, Opinion News & Top Stories',
            targetUrl: 'http://www.newindianexpress.com/opinions/2019/jan/15/did-south-asians-change-uks-destiny-1925264.html',
            targetTitle: 'Did south Asians change UK\'s destiny?- The New Indian Express',
            entityPairCount: 0,
            commonEntityCount: 8,
            commonStatementCount: 30
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'http://www.newindianexpress.com/opinions/2019/jan/15/did-south-asians-change-uks-destiny-1925264.html',
            sourceTitle: 'Did south Asians change UK\'s destiny?- The New Indian Express',
            targetUrl: 'https://www.straitstimes.com/opinion/asias-history-lessons-for-the-worlds-future',
            targetTitle: 'Asia\'s history lessons for the world\'s future, Opinion News & Top Stories',
            entityPairCount: 0,
            commonEntityCount: 8,
            commonStatementCount: 30
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.theguardian.com/uk-news/2019/jan/23/no-deal-brexit-incredibly-damaging-security-says-uk-counter-terror-head-neil-basu',
            sourceTitle: 'Far right may exploit Brexit tensions, says UK counter-terror chief',
            targetUrl: 'http://www.newindianexpress.com/opinions/2019/jan/15/did-south-asians-change-uks-destiny-1925264.html',
            targetTitle: 'Did south Asians change UK\'s destiny?- The New Indian Express',
            entityPairCount: 0,
            commonEntityCount: 3,
            commonStatementCount: 18
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'http://koreabizwire.com/asian-tourists-favor-myeongdong-but-americans-europeans-prioritize-palaces-in-seoul-study/131272',
            sourceTitle: 'Asian Tourists Favor Myeongdong but Americans, Europeans Prioritize Palaces in Seoul: Study',
            targetUrl: 'https://www.scmp.com/week-asia/opinion/article/2179716/asia-2019-watch-out-elections-india-and-indonesia-us-china',
            targetTitle: 'Asia in 2019: from elections in India and Indonesia to US-China tensions, Xinjiang and extreme weather',
            entityPairCount: 0,
            commonEntityCount: 4,
            commonStatementCount: 14
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.channelnewsasia.com/news/asia/indonesia-abu-bakar-bashir-early-release-cancelled-bali-bombings-11157000',
            sourceTitle: 'Indonesia cancels early release for Abu Bakar Bashir, radical cleric linked to Bali bombings',
            targetUrl: 'https://asia.nikkei.com/Economy/Indonesia-doubles-trade-missions-to-Muslim-markets-in-export-push',
            targetTitle: 'Indonesia doubles trade missions to Muslim markets in export push',
            entityPairCount: 0,
            commonEntityCount: 4,
            commonStatementCount: 23
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.cnbc.com/2018/09/06/crazy-rich-asians-wealth-in-asia-grows-faster-than-us-europe-in-2018.html',
            sourceTitle: '',
            targetUrl: 'https://www.straitstimes.com/opinion/asias-history-lessons-for-the-worlds-future',
            targetTitle: 'Asia\'s history lessons for the world\'s future, Opinion News & Top Stories',
            entityPairCount: 0,
            commonEntityCount: 4,
            commonStatementCount: 40
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.straitstimes.com/asia/east-asia/singapore-china-to-set-up-mediators-panel-for-belt-and-road-projects',
            sourceTitle: 'Singapore, China to set up mediators\' panel for Belt and Road projects, East Asia News & Top Stories',
            targetUrl: 'https://foreignpolicy.com/2018/11/28/china-is-violating-uighurs-human-rights-the-united-states-must-act/',
            targetTitle: 'China Is Violating Uighurs\' Human Rights. The United States Must Act. – Foreign Policy',
            entityPairCount: 0,
            commonEntityCount: 1,
            commonStatementCount: 5
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.reuters.com/article/us-autos-batteries-europe-insight/europe-up-against-asian-juggernaut-in-electric-car-battery-drive-idUSKCN1J10MF',
            sourceTitle: 'Europe up against Asian juggernaut in electric car battery drive',
            targetUrl: 'http://www.newindianexpress.com/opinions/2019/jan/15/did-south-asians-change-uks-destiny-1925264.html',
            targetTitle: 'Did south Asians change UK\'s destiny?- The New Indian Express',
            entityPairCount: 0,
            commonEntityCount: 7,
            commonStatementCount: 34
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://uk.finance.yahoo.com/news/brits-think-immigration-good-uk-000148479.html?guccounter=1',
            sourceTitle: 'Most Brits think immigration is good for the UK',
            targetUrl: 'http://www.pewforum.org/2017/11/29/europes-growing-muslim-population/',
            targetTitle: 'Muslim Population Growth in Europe',
            entityPairCount: 0,
            commonEntityCount: 1,
            commonStatementCount: 5
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://tmrresearchblog.com/recent-study-reveals-role-of-genetics-in-skin-color-evolution/',
            sourceTitle: 'Recent Study Reveals Role of Genetics in Skin Color Evolution',
            targetUrl: 'http://www.sciencemag.org/news/2019/01/surprising-reason-why-some-latin-americans-have-light-skin',
            targetTitle: 'The surprising reason why some Latin Americans have light skin',
            entityPairCount: 0,
            commonEntityCount: 6,
            commonStatementCount: 24
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.nytimes.com/2019/01/23/realestate/house-hunting-in-ecuador.html',
            sourceTitle: '',
            targetUrl: 'https://www.channelnewsasia.com/news/asia/philippines-law-muslim-autonomous-region-mindanao-milf-11167338',
            targetTitle: 'Landmark law ratified, paving way for Muslim autonomous region in southern Philippines',
            entityPairCount: 0,
            commonEntityCount: 0,
            commonStatementCount: 0
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://comicbook.com/marvel/2019/01/19/spider-man-far-from-home-crazy-rich-asians-star-remy-hii-role/',
            sourceTitle: 'Who Is Remy Hii Playing in \'Spider-Man: Far From Home?\'',
            targetUrl: 'https://dctheatrescene.com/2019/01/21/review-submission-a-dystopian-view-of-muslim-brotherhoods-takeover-of-europe/',
            targetTitle: 'Review: Submission, a dystopian view of Muslim Brotherhood\'s takeover of Europe',
            entityPairCount: 0,
            commonEntityCount: 2,
            commonStatementCount: 4
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://foreignpolicy.com/2018/11/28/china-is-violating-uighurs-human-rights-the-united-states-must-act/',
            sourceTitle: 'China Is Violating Uighurs\' Human Rights. The United States Must Act. – Foreign Policy',
            targetUrl: 'http://www.atimes.com/article/why-the-west-wont-act-on-chinas-uighur-crisis/',
            targetTitle: 'Why the West won\'t act on China\'s Uighur crisis',
            entityPairCount: 0,
            commonEntityCount: 9,
            commonStatementCount: 39
        },
        entitiesPair: []
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://www.weeklyblitz.net/news/turkey-exporting-radical-islam-into-south-asia-under-the-garb-of-relief/',
            sourceTitle: 'Turkey exporting radical Islam into South Asia under the garb of relief',
            targetUrl: 'http://www.atimes.com/how-pakistan-descended-into-poverty/',
            targetTitle: 'How Pakistan descended into poverty',
            entityPairCount: 0,
            commonEntityCount: 4,
            commonStatementCount: 25
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'http://europa.eu/rapid/press-release_IP-18-6136_en.htm',
            sourceTitle: 'Global Partners for Global Challenges',
            targetUrl: 'http://europa.eu/rapid/press-release_MEMO-19-542_en.htm',
            targetTitle: 'Eurobarometer survey on Antisemitism in Europe',
            entityPairCount: 0,
            commonEntityCount: 6,
            commonStatementCount: 30
        },
        entitiesPair: null
    }
    ,
    {
        meta:
        {
            sourceUrl: 'https://religionnews.com/2018/12/04/chinas-repression-of-uighurs-wont-stop-until-the-international-community-intervenes/',
            sourceTitle: 'China\'s repression of Uighurs won\'t stop until the international community intervenes',
            targetUrl: 'https://foreignpolicy.com/2018/11/28/china-is-violating-uighurs-human-rights-the-united-states-must-act/',
            targetTitle: 'China Is Violating Uighurs\' Human Rights. The United States Must Act. – Foreign Policy',
            entityPairCount: 0,
            commonEntityCount: 8,
            commonStatementCount: 38
        },
        entitiesPair: []
    }
]

for (let i = 0; i < a.length ; i ++) {
    if (a[i].entitiesPair === null) {
        a[i].entitiesPair = []
    }
}

a.sort((x,y) => y.entitiesPair.length - x.entitiesPair.length)

for (let i = 0; i < a.length ; i ++) {
    if (a[i].entitiesPair.length > 0) {
        utils.logFullObject(a[i])
        // console.log(a[i].entitiesPair.length)
    }
}