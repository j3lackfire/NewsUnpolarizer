/**
 * Created by Le Pham Minh Duc on 15-Oct-18.
 */
const relevanceProcessor = require('./Unpolarizer/relevanceProcessor')
const articlesComparer = require('./Unpolarizer/articlesComparer')
const dbReader = require('./LocalDB/dbReader')
const utils = require('./utils')

// dbReader.readDbAsJson((err, res) => {
//     for (let i = 0; i < res.length; i ++) {
//         articlesComparer.findMostRelevanceByUrl(res[i].meta.url, (err, result) => {
//             if (utils.isNullOrUndefined(result)) {
//                 let metaObject = {}
//                 metaObject = res[i].meta
//                 metaObject.relatedTriplesCount = 0
//                 metaObject.relatedSentencesCount = 0
//                 utils.logFullObject(metaObject)
//             } else {
//                 utils.logFullObject(result[0].meta)
//             }
//             console.log(",")
//         })
//     }
// })

// let url = "http://www.atimes.com/article/why-the-west-wont-act-on-chinas-uighur-crisis/"
// articlesComparer.findMostRelevanceByUrl(url, (err, res) => {
//     utils.logFullObject(res)
// })

let a = [{
    sourceUrl: 'https://www.haaretz.com/world-news/europe/no-europe-isn-t-returning-to-the-bosom-of-islam-1.6572926',
    sourceTitle: 'No, Europe isn\'t returning to the bosom of Islam',
    targetUrl: 'http://www.pewforum.org/2017/11/29/europes-growing-muslim-population/',
    targetTitle: 'Muslim Population Growth in Europe',
    relatedTriplesCount: 2,
    relatedSentencesCount: 2
}
    ,
    {
        sourceUrl: 'http://www.pewforum.org/2018/05/29/being-christian-in-western-europe/',
        sourceTitle: 'Attitudes of Christians in Western Europe',
        targetUrl: 'https://www.gatestoneinstitute.org/13490/islamic-university-europe-netherlands',
        targetTitle: 'What is Being Taught at the "Islamic University of Europe" in the Netherlands?',
        relatedTriplesCount: 1,
        relatedSentencesCount: 1
    }
    ,
    {
        sourceUrl: 'https://www.theatlantic.com/international/archive/2018/05/akbar-ahmed-islam-europe/559391/',
        sourceTitle: 'How Muslim Migration Is Reshaping Europe',
        targetUrl: 'https://immigrationlab.org/project/the-struggle-to-integrate-muslims-in-europe/',
        targetTitle: 'The Struggle to Integrate Muslims in Europe',
        relatedTriplesCount: 2,
        relatedSentencesCount: 2
    }
    ,
    {
        sourceUrl: 'http://www.pewresearch.org/fact-tank/2017/11/29/5-facts-about-the-muslim-population-in-europe/',
        sourceTitle: '5 facts about the Muslim population in Europe',
        targetUrl: 'http://www.pewforum.org/2017/11/29/europes-growing-muslim-population/',
        targetTitle: 'Muslim Population Growth in Europe',
        relatedTriplesCount: 84,
        relatedSentencesCount: 22
    }
    ,
    {
        sourceUrl: 'https://www.thenational.ae/world/europe/attacks-against-uk-muslims-increase-in-violence-1.797179',
        sourceTitle: 'Attacks against UK Muslims increase in violence',
        targetUrl: 'https://immigrationlab.org/project/the-struggle-to-integrate-muslims-in-europe/',
        targetTitle: 'The Struggle to Integrate Muslims in Europe',
        relatedTriplesCount: 3,
        relatedSentencesCount: 2
    }
    ,
    {
        sourceUrl: 'https://www.politico.eu/article/with-anti-muslim-laws-france-denmark-europe-enters-new-dark-age/',
        sourceTitle: 'With anti-Muslim laws, Europe enters new dark age – POLITICO',
        targetUrl: 'https://www.reuters.com/article/us-autos-batteries-europe-insight/europe-up-against-asian-juggernaut-in-electric-car-battery-drive-idUSKCN1J10MF',
        targetTitle: 'Europe up against Asian juggernaut in electric car battery drive',
        relatedTriplesCount: 4,
        relatedSentencesCount: 2
    }
    ,
    {
        sourceUrl: 'https://www.alaraby.co.uk/english/society/2018/11/28/ambassador-of-islam-professor-akbar-ahmed',
        sourceTitle: '\'Ambassador of Islam\': Talking religion, immigration and identity',
        targetUrl: 'http://www.pewforum.org/2011/01/27/the-future-of-the-global-muslim-population/',
        targetTitle: 'The Future of the Global Muslim Population',
        relatedTriplesCount: 67,
        relatedSentencesCount: 12
    }
    ,
    {
        sourceUrl: 'https://www.dw.com/en/seehofer-tells-islam-conference-muslims-are-a-part-of-germany/a-46489983',
        sourceTitle: 'Seehofer tells Islam conference Muslims are a part of Germany',
        targetUrl: 'https://www.theatlantic.com/international/archive/2019/01/bosnia-offers-model-liberal-european-islam/579529/',
        targetTitle: 'Bosnia Offers a Model of Liberal European Islam',
        relatedTriplesCount: 1,
        relatedSentencesCount: 1
    }
    ,
    {
        sourceUrl: 'http://www.pewforum.org/2017/11/29/europes-growing-muslim-population/',
        sourceTitle: 'Muslim Population Growth in Europe',
        targetUrl: 'http://www.pewforum.org/2011/01/27/the-future-of-the-global-muslim-population/',
        targetTitle: 'The Future of the Global Muslim Population',
        relatedTriplesCount: 347,
        relatedSentencesCount: 89
    }
    ,
    {
        sourceUrl: 'https://www.aljazeera.com/programmes/specialseries/2018/08/victim-attacks-affected-muslims-europe-180801145915309.html',
        sourceTitle: 'Twice a Victim: How Have Attacks Affected Muslims in Europe?',
        targetUrl: 'http://www.pewforum.org/2011/01/27/the-future-of-the-global-muslim-population/',
        targetTitle: 'The Future of the Global Muslim Population',
        relatedTriplesCount: 2,
        relatedSentencesCount: 2
    }
    ,
    {
        sourceUrl: 'http://www.pewforum.org/2018/10/29/eastern-and-western-europeans-differ-on-importance-of-religion-views-of-minorities-and-key-social-issues/',
        sourceTitle: 'Eastern and Western Europeans Differ on Importance of Religion, Views of Minorities, and Key Social Issues',
        targetUrl: 'http://www.pewforum.org/2017/11/29/europes-growing-muslim-population/',
        targetTitle: 'Muslim Population Growth in Europe',
        relatedTriplesCount: 3,
        relatedSentencesCount: 3
    }
    ,
    {
        sourceUrl: 'https://www.theguardian.com/world/2017/nov/29/muslim-population-in-europe-could-more-than-double',
        sourceTitle: 'Muslim population in some EU countries could triple, says report',
        targetUrl: 'http://www.pewforum.org/2017/11/29/europes-growing-muslim-population/',
        targetTitle: 'Muslim Population Growth in Europe',
        relatedTriplesCount: 108,
        relatedSentencesCount: 40
    }
    ,
    {
        sourceUrl: 'https://immigrationlab.org/project/the-struggle-to-integrate-muslims-in-europe/',
        sourceTitle: 'The Struggle to Integrate Muslims in Europe',
        targetUrl: 'http://www.pewforum.org/2011/01/27/the-future-of-the-global-muslim-population/',
        targetTitle: 'The Future of the Global Muslim Population',
        relatedTriplesCount: 22,
        relatedSentencesCount: 8
    }
    ,
    {
        sourceUrl: 'https://www.theatlantic.com/international/archive/2019/01/bosnia-offers-model-liberal-european-islam/579529/',
        sourceTitle: 'Bosnia Offers a Model of Liberal European Islam',
        targetUrl: 'http://www.pewforum.org/2017/11/29/europes-growing-muslim-population/',
        targetTitle: 'Muslim Population Growth in Europe',
        relatedTriplesCount: 5,
        relatedSentencesCount: 3
    }
    ,
    {
        sourceUrl: 'https://www.politico.eu/article/muslims-integrate-in-europe-despite-discrimination-study/',
        sourceTitle: 'Muslims integrate in Europe despite discrimination: study – POLITICO',
        targetUrl: 'http://www.pewforum.org/2011/01/27/the-future-of-the-global-muslim-population/',
        targetTitle: 'The Future of the Global Muslim Population',
        relatedTriplesCount: 9,
        relatedSentencesCount: 6
    }
    ,
    {
        sourceUrl: 'http://www.pewforum.org/2011/01/27/the-future-of-the-global-muslim-population/',
        sourceTitle: 'The Future of the Global Muslim Population',
        targetUrl: 'http://www.pewforum.org/2017/11/29/europes-growing-muslim-population/',
        targetTitle: 'Muslim Population Growth in Europe',
        relatedTriplesCount: 347,
        relatedSentencesCount: 89
    }
    ,
    {
        url: 'https://eu.usatoday.com/story/money/2018/12/24/toblerone-halal-controversy-chocolate-bar-boycotted-far-right/2405914002/',
        title: 'Toblerone halal controversy: Chocolate boycotted by Europe\'s far-right',
        relatedTriplesCount: 0,
        relatedSentencesCount: 0
    }
    ,
    {
        sourceUrl: 'http://europa.eu/rapid/press-release_MEMO-19-542_en.htm',
        sourceTitle: 'Eurobarometer survey on Antisemitism in Europe',
        targetUrl: 'http://www.newindianexpress.com/opinions/2019/jan/15/did-south-asians-change-uks-destiny-1925264.html',
        targetTitle: 'Did south Asians change UK\'s destiny?- The New Indian Express',
        relatedTriplesCount: 5,
        relatedSentencesCount: 3
    }
    ,
    {
        sourceUrl: 'https://www.thetrumpet.com/18331-denmark-handshake-enforces-european-values-on-muslims',
        sourceTitle: 'Denmark Handshake Enforces European Values on Muslims',
        targetUrl: 'http://www.pewforum.org/2011/01/27/the-future-of-the-global-muslim-population/',
        targetTitle: 'The Future of the Global Muslim Population',
        relatedTriplesCount: 8,
        relatedSentencesCount: 5
    }
    ,
    {
        sourceUrl: 'https://www.wsj.com/articles/europes-right-wing-woos-a-new-audience-jewish-voters-11546257601',
        sourceTitle: 'Europe\'s Right Wing Woos a New Audience: Jewish Voters',
        targetUrl: 'https://www.theguardian.com/world/2017/nov/29/muslim-population-in-europe-could-more-than-double',
        targetTitle: 'Muslim population in some EU countries could triple, says report',
        relatedTriplesCount: 5,
        relatedSentencesCount: 5
    }
    ,
    {
        sourceUrl: 'https://www.straitstimes.com/forum/letters-in-print/vital-to-stand-with-malay-muslim-community',
        sourceTitle: 'Vital to stand with Malay-Muslim community, Letters in Print News & Top Stories',
        targetUrl: 'http://www.sciencemag.org/news/2019/01/surprising-reason-why-some-latin-americans-have-light-skin',
        targetTitle: 'The surprising reason why some Latin Americans have light skin',
        relatedTriplesCount: 3,
        relatedSentencesCount: 3
    }
    ,
    {
        url: 'https://dctheatrescene.com/2019/01/21/review-submission-a-dystopian-view-of-muslim-brotherhoods-takeover-of-europe/',
        title: 'Review: Submission, a dystopian view of Muslim Brotherhood\'s takeover of Europe',
        relatedTriplesCount: 0,
        relatedSentencesCount: 0
    }
    ,
    {
        sourceUrl: 'https://foreignpolicy.com/2019/01/05/michel-houellebecq-hated-europe-before-you-did/',
        sourceTitle: 'Michel Houellebecq Hated Europe Before You Did – Foreign Policy',
        targetUrl: 'http://www.pewforum.org/2017/11/29/europes-growing-muslim-population/',
        targetTitle: 'Muslim Population Growth in Europe',
        relatedTriplesCount: 6,
        relatedSentencesCount: 3
    }
    ,
    {
        sourceUrl: 'https://www.theamericanconservative.com/articles/the-immigrants-challenging-europes-code-of-silence-on-islam/',
        sourceTitle: 'The Immigrants Challenging Europe\'s Code of Silence on Islam',
        targetUrl: 'https://foreignpolicy.com/2019/01/05/michel-houellebecq-hated-europe-before-you-did/',
        targetTitle: 'Michel Houellebecq Hated Europe Before You Did – Foreign Policy',
        relatedTriplesCount: 2,
        relatedSentencesCount: 2
    }
    ,
    {
        sourceUrl: 'https://www.yenisafak.com/en/world/philippines-milf-seeks-more-turkish-support-after-muslim-region-votes-3472368',
        sourceTitle: 'Philippines\' MILF seeks more Turkish support after Muslim region votes',
        targetUrl: 'https://asia.nikkei.com/Politics/Philippine-rebels-on-cusp-of-Muslim-autonomy-dream',
        targetTitle: 'Philippine rebels on cusp of Muslim autonomy dream',
        relatedTriplesCount: 13,
        relatedSentencesCount: 2
    }
    ,
    {
        sourceUrl: 'https://www.gatestoneinstitute.org/13490/islamic-university-europe-netherlands',
        sourceTitle: 'What is Being Taught at the "Islamic University of Europe" in the Netherlands?',
        targetUrl: 'http://www.pewforum.org/2011/01/27/the-future-of-the-global-muslim-population/',
        targetTitle: 'The Future of the Global Muslim Population',
        relatedTriplesCount: 5,
        relatedSentencesCount: 2
    }
    ,
    {
        sourceUrl: 'https://www.theguardian.com/cities/2019/jan/02/turkey-is-kosovo-controversy-over-balkan-states-new-central-mosque',
        sourceTitle: 'Turkey\'s gift of a mosque sparks fears of \'neo-Ottomanism\' in Kosovo',
        targetUrl: 'https://www.weeklyblitz.net/news/turkey-exporting-radical-islam-into-south-asia-under-the-garb-of-relief/',
        targetTitle: 'Turkey exporting radical Islam into South Asia under the garb of relief',
        relatedTriplesCount: 2,
        relatedSentencesCount: 2
    }
    ,
    {
        sourceUrl: 'https://theconversation.com/why-do-muslim-women-wear-a-hijab-109717',
        sourceTitle: 'Why do Muslim women wear a hijab?',
        targetUrl: 'http://www.pewforum.org/2017/11/29/europes-growing-muslim-population/',
        targetTitle: 'Muslim Population Growth in Europe',
        relatedTriplesCount: 5,
        relatedSentencesCount: 3
    }
    ,
    {
        url: 'https://clarionproject.org/fatality-of-western-embrace-of-political-islam/',
        title: 'Fatality of Western Embrace of Political Islam',
        relatedTriplesCount: 0,
        relatedSentencesCount: 0
    }
    ,
    {
        sourceUrl: 'https://www.bbc.com/news/world-europe-46933236',
        sourceTitle: '#10YearChallenge; Turkey puts spotlight on the headscarf',
        targetUrl: 'https://www.bbc.com/news/world-asia-india-46997965',
        targetTitle: 'Assam citizenship bill: Anti-migrant protests rock north-east India',
        relatedTriplesCount: 2,
        relatedSentencesCount: 2
    }
    ,
    {
        sourceUrl: 'https://www.aljazeera.com/indepth/opinion/chinese-islamophobia-west-190121131831245.html',
        sourceTitle: 'Chinese Islamophobia was made in the West',
        targetUrl: 'http://www.pewforum.org/2017/11/29/europes-growing-muslim-population/',
        targetTitle: 'Muslim Population Growth in Europe',
        relatedTriplesCount: 6,
        relatedSentencesCount: 4
    }
    ,
    {
        sourceUrl: 'https://www.nytimes.com/2019/01/18/opinion/donald-trump-russia-putin.html',
        sourceTitle: '',
        targetUrl: 'https://www.straitstimes.com/asia/south-asia/angry-muslim-american-lawmaker-rashida-tlaib-shatters-stereotype-dawn-columnist',
        targetTitle: 'Angry, Muslim-American lawmaker Rashida Tlaib shatters stereotype: Dawn columnist, South Asia News & Top Stories',
        relatedTriplesCount: 6,
        relatedSentencesCount: 4
    }
    ,
    {
        sourceUrl: 'https://www.gatestoneinstitute.org/13543/strasbourg-capital-europe',
        sourceTitle: 'Strasbourg: Capital of the EU and "The Future of Europe"',
        targetUrl: 'https://www.theatlantic.com/international/archive/2019/01/bosnia-offers-model-liberal-european-islam/579529/',
        targetTitle: 'Bosnia Offers a Model of Liberal European Islam',
        relatedTriplesCount: 1,
        relatedSentencesCount: 1
    }
    ,
    {
        sourceUrl: 'https://blogs.timesofisrael.com/why-as-a-muslim-i-feel-holocaust-memorial-day-is-as-essential-as-ever/',
        sourceTitle: 'Why as a Muslim, I feel Holocaust Memorial Day is as essential as ever',
        targetUrl: 'https://www.straitstimes.com/asia/a-retreat-in-the-face-of-danger-the-nation',
        targetTitle: 'A retreat in the face of danger: The Nation, Asia News & Top Stories',
        relatedTriplesCount: 1,
        relatedSentencesCount: 1
    }
    ,
    {
        sourceUrl: 'http://www.atimes.com/article/why-the-west-wont-act-on-chinas-uighur-crisis/',
        sourceTitle: 'Why the West won\'t act on China\'s Uighur crisis',
        targetUrl: 'http://www.pewforum.org/2017/11/29/europes-growing-muslim-population/',
        targetTitle: 'Muslim Population Growth in Europe',
        relatedTriplesCount: 5,
        relatedSentencesCount: 3
    }
    ,
    {
        sourceUrl: 'https://www.nytimes.com/2019/01/21/opinion/ilhan-omar-israel-jews.html',
        sourceTitle: '',
        targetUrl: 'https://www.politico.eu/article/with-anti-muslim-laws-france-denmark-europe-enters-new-dark-age/',
        targetTitle: 'With anti-Muslim laws, Europe enters new dark age – POLITICO',
        relatedTriplesCount: 1,
        relatedSentencesCount: 1
    }
    ,
    {
        sourceUrl: 'https://www.channelnewsasia.com/news/world/bosnian-muslims-anger-serbs-with-name-change-plan--eu-calls-for-calm-11164186',
        sourceTitle: 'Bosnian Muslims anger Serbs with name change plan, EU calls for calm',
        targetUrl: 'http://muslimnews.co.uk/newspaper/world-news/34570-2/',
        targetTitle: 'Three Hui mosques raided in China\'s Yunnan province',
        relatedTriplesCount: 1,
        relatedSentencesCount: 1
    }
    ,
    {
        sourceUrl: 'https://asia.nikkei.com/Economy/Indonesia-doubles-trade-missions-to-Muslim-markets-in-export-push',
        sourceTitle: 'Indonesia doubles trade missions to Muslim markets in export push',
        targetUrl: 'https://kr-asia.com/the-muslim-travel-market-is-growing-but-where-are-its-unicorns',
        targetTitle: 'The Muslim travel market is growing, but where are its unicorns?',
        relatedTriplesCount: 2,
        relatedSentencesCount: 2
    }
    ,
    {
        sourceUrl: 'https://www.straitstimes.com/asia/se-asia/muslim-self-rule-backed-in-philippines-troubled-mindanao',
        sourceTitle: 'Muslim self-rule backed in Philippines\' troubled Mindanao, SE Asia News & Top Stories',
        targetUrl: 'https://www.channelnewsasia.com/news/asia/philippines-law-muslim-autonomous-region-mindanao-milf-11167338',
        targetTitle: 'Landmark law ratified, paving way for Muslim autonomous region in southern Philippines',
        relatedTriplesCount: 8,
        relatedSentencesCount: 3
    }
    ,
    {
        sourceUrl: 'https://www.straitstimes.com/asia/se-asia/chinese-indonesian-politician-reports-muslim-official-over-mandarin-campaign-remark',
        sourceTitle: 'Chinese-Indonesian politician reports Muslim official over Mandarin campaign remark, SE Asia News & Top Stories',
        targetUrl: 'https://foreignpolicy.com/2018/11/28/china-is-violating-uighurs-human-rights-the-united-states-must-act/',
        targetTitle: 'China Is Violating Uighurs\' Human Rights. The United States Must Act. – Foreign Policy',
        relatedTriplesCount: 3,
        relatedSentencesCount: 2
    }
    ,
    {
        sourceUrl: 'https://www.channelnewsasia.com/news/asia/philippines-law-muslim-autonomous-region-mindanao-milf-11167338',
        sourceTitle: 'Landmark law ratified, paving way for Muslim autonomous region in southern Philippines',
        targetUrl: 'https://www.straitstimes.com/asia/se-asia/muslim-self-rule-backed-in-philippines-troubled-mindanao',
        targetTitle: 'Muslim self-rule backed in Philippines\' troubled Mindanao, SE Asia News & Top Stories',
        relatedTriplesCount: 8,
        relatedSentencesCount: 3
    }
    ,
    {
        sourceUrl: 'https://www.straitstimes.com/asia/south-asia/angry-muslim-american-lawmaker-rashida-tlaib-shatters-stereotype-dawn-columnist',
        sourceTitle: 'Angry, Muslim-American lawmaker Rashida Tlaib shatters stereotype: Dawn columnist, South Asia News & Top Stories',
        targetUrl: 'http://www.pewforum.org/2011/01/27/the-future-of-the-global-muslim-population/',
        targetTitle: 'The Future of the Global Muslim Population',
        relatedTriplesCount: 12,
        relatedSentencesCount: 7
    }
    ,
    {
        sourceUrl: 'https://www.straitstimes.com/asia/se-asia/sarawak-church-wedding-with-muslim-bridesmaids',
        sourceTitle: 'Sarawak church wedding with Muslim bridesmaids, SE Asia News & Top Stories',
        targetUrl: 'https://www.straitstimes.com/asia/se-asia/interracial-harmony-sarawak-church-wedding-with-muslim-bridesmaids',
        targetTitle: 'Interracial harmony: Sarawak church wedding with Muslim bridesmaids, SE Asia News & Top Stories',
        relatedTriplesCount: 3,
        relatedSentencesCount: 3
    }
    ,
    {
        sourceUrl: 'http://muslimnews.co.uk/newspaper/world-news/34570-2/',
        sourceTitle: 'Three Hui mosques raided in China\'s Yunnan province',
        targetUrl: 'https://foreignpolicy.com/2018/11/28/china-is-violating-uighurs-human-rights-the-united-states-must-act/',
        targetTitle: 'China Is Violating Uighurs\' Human Rights. The United States Must Act. – Foreign Policy',
        relatedTriplesCount: 1,
        relatedSentencesCount: 1
    }
    ,
    {
        sourceUrl: 'https://www.bbc.com/news/world-asia-india-46997965',
        sourceTitle: 'Assam citizenship bill: Anti-migrant protests rock north-east India',
        targetUrl: 'https://www.bbc.com/news/world-europe-46933236',
        targetTitle: '#10YearChallenge; Turkey puts spotlight on the headscarf',
        relatedTriplesCount: 2,
        relatedSentencesCount: 2
    }
    ,
    {
        sourceUrl: 'https://www.straitstimes.com/asia/se-asia/interracial-harmony-sarawak-church-wedding-with-muslim-bridesmaids',
        sourceTitle: 'Interracial harmony: Sarawak church wedding with Muslim bridesmaids, SE Asia News & Top Stories',
        targetUrl: 'https://www.straitstimes.com/asia/se-asia/sarawak-church-wedding-with-muslim-bridesmaids',
        targetTitle: 'Sarawak church wedding with Muslim bridesmaids, SE Asia News & Top Stories',
        relatedTriplesCount: 3,
        relatedSentencesCount: 3
    }
    ,
    {
        sourceUrl: 'https://asia.nikkei.com/Politics/Philippine-rebels-on-cusp-of-Muslim-autonomy-dream',
        sourceTitle: 'Philippine rebels on cusp of Muslim autonomy dream',
        targetUrl: 'https://www.yenisafak.com/en/world/philippines-milf-seeks-more-turkish-support-after-muslim-region-votes-3472368',
        targetTitle: 'Philippines\' MILF seeks more Turkish support after Muslim region votes',
        relatedTriplesCount: 13,
        relatedSentencesCount: 2
    }
    ,
    {
        sourceUrl: 'https://metro.co.uk/2019/01/22/rahaf-al-qunun-has-raised-a-major-taboo-that-some-muslims-reject-their-faith-8363479/',
        sourceTitle: 'Rahaf al-Qunun has raised a major taboo: that some Muslims reject their faith',
        targetUrl: 'http://www.pewforum.org/2011/01/27/the-future-of-the-global-muslim-population/',
        targetTitle: 'The Future of the Global Muslim Population',
        relatedTriplesCount: 18,
        relatedSentencesCount: 5
    }
    ,
    {
        sourceUrl: 'https://www.scmp.com/week-asia/society/article/2182790/muslim-teen-rahaf-mohammed-safe-canada-what-if-she-were-malaysian',
        sourceTitle: 'Muslim teen Rahaf Mohammed is safe in Canada. What if she were Malaysian or Indonesian?',
        targetUrl: 'http://www.pewforum.org/2011/01/27/the-future-of-the-global-muslim-population/',
        targetTitle: 'The Future of the Global Muslim Population',
        relatedTriplesCount: 8,
        relatedSentencesCount: 5
    }
    ,
    {
        sourceUrl: 'https://www.nybooks.com/articles/2019/02/07/reeducating-xinjiangs-muslims/',
        sourceTitle: '\'Reeducating\' Xinjiang\'s Muslims',
        targetUrl: 'https://foreignpolicy.com/2018/11/28/china-is-violating-uighurs-human-rights-the-united-states-must-act/',
        targetTitle: 'China Is Violating Uighurs\' Human Rights. The United States Must Act. – Foreign Policy',
        relatedTriplesCount: 4,
        relatedSentencesCount: 3
    }
    ,
    {
        sourceUrl: 'https://www.christianpost.com/news/pakistans-top-court-to-decide-asia-bibis-fate-as-muslim-extremists-demand-her-death.html',
        sourceTitle: 'Pakistan\'s top court to decide Asia Bibi\'s fate as Muslim extremists demand her death',
        targetUrl: 'https://www.bbc.com/news/world-europe-46933236',
        targetTitle: '#10YearChallenge; Turkey puts spotlight on the headscarf',
        relatedTriplesCount: 2,
        relatedSentencesCount: 2
    }
    ,
    {
        sourceUrl: 'https://www.channelnewsasia.com/news/world/central-african-soccer-executive-faces-war-crimes-judges-in-the-hague-11167822',
        sourceTitle: 'Central African soccer executive faces war crimes judges in The Hague',
        targetUrl: 'https://www.wsj.com/articles/europes-right-wing-woos-a-new-audience-jewish-voters-11546257601',
        targetTitle: 'Europe\'s Right Wing Woos a New Audience: Jewish Voters',
        relatedTriplesCount: 2,
        relatedSentencesCount: 2
    }
    ,
    {
        sourceUrl: 'https://www.straitstimes.com/asia/a-retreat-in-the-face-of-danger-the-nation',
        sourceTitle: 'A retreat in the face of danger: The Nation, Asia News & Top Stories',
        targetUrl: 'https://blogs.timesofisrael.com/why-as-a-muslim-i-feel-holocaust-memorial-day-is-as-essential-as-ever/',
        targetTitle: 'Why as a Muslim, I feel Holocaust Memorial Day is as essential as ever',
        relatedTriplesCount: 1,
        relatedSentencesCount: 1
    }
    ,
    {
        sourceUrl: 'https://www.straitstimes.com/asia/se-asia/malay-group-wants-malaysia-declared-an-islamic-state',
        sourceTitle: 'Malay group Ikatan Muslimin Malaysia wants Malaysia declared an \'Islamic state\', SE Asia News & Top Stories',
        targetUrl: 'https://metro.co.uk/2019/01/22/rahaf-al-qunun-has-raised-a-major-taboo-that-some-muslims-reject-their-faith-8363479/',
        targetTitle: 'Rahaf al-Qunun has raised a major taboo: that some Muslims reject their faith',
        relatedTriplesCount: 2,
        relatedSentencesCount: 2
    }
    ,
    {
        url: 'https://www.bbc.com/news/world-asia-46312889',
        title: 'What awaits any Rohingya refugees who return to Myanmar?',
        relatedTriplesCount: 0,
        relatedSentencesCount: 0
    }
    ,
    {
        sourceUrl: 'https://www.channelnewsasia.com/news/asia/indonesia-abu-bakar-bashir-early-release-cancelled-bali-bombings-11157000',
        sourceTitle: 'Indonesia cancels early release for Abu Bakar Bashir, radical cleric linked to Bali bombings',
        targetUrl: 'https://asia.nikkei.com/Economy/Indonesia-doubles-trade-missions-to-Muslim-markets-in-export-push',
        targetTitle: 'Indonesia doubles trade missions to Muslim markets in export push',
        relatedTriplesCount: 6,
        relatedSentencesCount: 1
    }
    ,
    {
        sourceUrl: 'https://www.iol.co.za/travel/travel-news/halaal-tourism-is-on-the-rise-18891396',
        sourceTitle: '',
        targetUrl: 'http://www.pewforum.org/2011/01/27/the-future-of-the-global-muslim-population/',
        targetTitle: 'The Future of the Global Muslim Population',
        relatedTriplesCount: 7,
        relatedSentencesCount: 4
    }
    ,
    {
        sourceUrl: 'https://kr-asia.com/the-muslim-travel-market-is-growing-but-where-are-its-unicorns',
        sourceTitle: 'The Muslim travel market is growing, but where are its unicorns?',
        targetUrl: 'https://www.straitstimes.com/opinion/asias-history-lessons-for-the-worlds-future',
        targetTitle: 'Asia\'s history lessons for the world\'s future, Opinion News & Top Stories',
        relatedTriplesCount: 3,
        relatedSentencesCount: 3
    }
    ,
    {
        sourceUrl: 'https://www.aa.com.tr/en/asia-pacific/india-muslim-hindu-couples-kids-have-property-rights/1372272',
        sourceTitle: 'India: Muslim-Hindu couples\' kids have property rights',
        targetUrl: 'http://www.pewforum.org/2011/01/27/the-future-of-the-global-muslim-population/',
        targetTitle: 'The Future of the Global Muslim Population',
        relatedTriplesCount: 4,
        relatedSentencesCount: 2
    }
    ,
    {
        url: 'https://www.aa.com.tr/en/asia-pacific/india-4-convicted-in-2002-muslim-massacre-get-bail/1372208',
        title: 'India: 4 convicted in 2002 Muslim massacre get bail',
        relatedTriplesCount: 0,
        relatedSentencesCount: 0
    }
    ,
    {
        sourceUrl: 'https://www.scmp.com/week-asia/opinion/article/2179716/asia-2019-watch-out-elections-india-and-indonesia-us-china',
        sourceTitle: 'Asia in 2019: from elections in India and Indonesia to US-China tensions, Xinjiang and extreme weather',
        targetUrl: 'https://www.straitstimes.com/opinion/asias-history-lessons-for-the-worlds-future',
        targetTitle: 'Asia\'s history lessons for the world\'s future, Opinion News & Top Stories',
        relatedTriplesCount: 14,
        relatedSentencesCount: 9
    }
    ,
    {
        sourceUrl: 'http://www.atimes.com/how-pakistan-descended-into-poverty/',
        sourceTitle: 'How Pakistan descended into poverty',
        targetUrl: 'https://www.alaraby.co.uk/english/society/2018/11/28/ambassador-of-islam-professor-akbar-ahmed',
        targetTitle: '\'Ambassador of Islam\': Talking religion, immigration and identity',
        relatedTriplesCount: 4,
        relatedSentencesCount: 2
    }
    ,
    {
        sourceUrl: 'https://www.channelnewsasia.com/news/asia/pakistan-eases-visa-rules-to--heaven-for-tourists--11166912',
        sourceTitle: 'Pakistan eases visa rules to \'heaven for tourists\'',
        targetUrl: 'http://www.pewforum.org/2017/11/29/europes-growing-muslim-population/',
        targetTitle: 'Muslim Population Growth in Europe',
        relatedTriplesCount: 5,
        relatedSentencesCount: 3
    }
    ,
    {
        sourceUrl: 'http://www.sciencemag.org/news/2019/01/surprising-reason-why-some-latin-americans-have-light-skin',
        sourceTitle: 'The surprising reason why some Latin Americans have light skin',
        targetUrl: 'https://tmrresearchblog.com/recent-study-reveals-role-of-genetics-in-skin-color-evolution/',
        targetTitle: 'Recent Study Reveals Role of Genetics in Skin Color Evolution',
        relatedTriplesCount: 5,
        relatedSentencesCount: 4
    }
    ,
    {
        sourceUrl: 'http://koreabizwire.com/asian-tourists-favor-myeongdong-but-americans-europeans-prioritize-palaces-in-seoul-study/131272',
        sourceTitle: 'Asian Tourists Favor Myeongdong but Americans, Europeans Prioritize Palaces in Seoul: Study',
        targetUrl: 'https://foreignpolicy.com/2018/11/28/china-is-violating-uighurs-human-rights-the-united-states-must-act/',
        targetTitle: 'China Is Violating Uighurs\' Human Rights. The United States Must Act. – Foreign Policy',
        relatedTriplesCount: 4,
        relatedSentencesCount: 2
    }
    ,
    {
        sourceUrl: 'https://www.straitstimes.com/opinion/asias-history-lessons-for-the-worlds-future',
        sourceTitle: 'Asia\'s history lessons for the world\'s future, Opinion News & Top Stories',
        targetUrl: 'https://www.scmp.com/week-asia/opinion/article/2179716/asia-2019-watch-out-elections-india-and-indonesia-us-china',
        targetTitle: 'Asia in 2019: from elections in India and Indonesia to US-China tensions, Xinjiang and extreme weather',
        relatedTriplesCount: 14,
        relatedSentencesCount: 9
    }
    ,
    {
        url: 'https://www.straitstimes.com/asia/east-asia/singapore-china-to-set-up-mediators-panel-for-belt-and-road-projects',
        title: 'Singapore, China to set up mediators\' panel for Belt and Road projects, East Asia News & Top Stories',
        relatedTriplesCount: 0,
        relatedSentencesCount: 0
    }
    ,
    {
        sourceUrl: 'https://tmrresearchblog.com/recent-study-reveals-role-of-genetics-in-skin-color-evolution/',
        sourceTitle: 'Recent Study Reveals Role of Genetics in Skin Color Evolution',
        targetUrl: 'http://www.sciencemag.org/news/2019/01/surprising-reason-why-some-latin-americans-have-light-skin',
        targetTitle: 'The surprising reason why some Latin Americans have light skin',
        relatedTriplesCount: 5,
        relatedSentencesCount: 4
    }
    ,
    {
        sourceUrl: 'https://www.straitstimes.com/asia/bringing-you-insights-from-across-asia',
        sourceTitle: 'Bringing you insights from across Asia, Asia News & Top Stories',
        targetUrl: 'https://www.straitstimes.com/opinion/asias-history-lessons-for-the-worlds-future',
        targetTitle: 'Asia\'s history lessons for the world\'s future, Opinion News & Top Stories',
        relatedTriplesCount: 3,
        relatedSentencesCount: 3
    }
    ,
    {
        sourceUrl: 'http://www.newindianexpress.com/opinions/2019/jan/15/did-south-asians-change-uks-destiny-1925264.html',
        sourceTitle: 'Did south Asians change UK\'s destiny?- The New Indian Express',
        targetUrl: 'http://europa.eu/rapid/press-release_MEMO-19-542_en.htm',
        targetTitle: 'Eurobarometer survey on Antisemitism in Europe',
        relatedTriplesCount: 5,
        relatedSentencesCount: 3
    }
    ,
    {
        sourceUrl: 'https://www.cnbc.com/2018/09/06/crazy-rich-asians-wealth-in-asia-grows-faster-than-us-europe-in-2018.html',
        sourceTitle: '',
        targetUrl: 'https://www.straitstimes.com/opinion/asias-history-lessons-for-the-worlds-future',
        targetTitle: 'Asia\'s history lessons for the world\'s future, Opinion News & Top Stories',
        relatedTriplesCount: 8,
        relatedSentencesCount: 3
    }
    ,
    {
        sourceUrl: 'https://www.reuters.com/article/us-autos-batteries-europe-insight/europe-up-against-asian-juggernaut-in-electric-car-battery-drive-idUSKCN1J10MF',
        sourceTitle: 'Europe up against Asian juggernaut in electric car battery drive',
        targetUrl: 'https://www.wsj.com/articles/europes-right-wing-woos-a-new-audience-jewish-voters-11546257601',
        targetTitle: 'Europe\'s Right Wing Woos a New Audience: Jewish Voters',
        relatedTriplesCount: 4,
        relatedSentencesCount: 3
    }
    ,
    {
        url: 'https://uk.finance.yahoo.com/news/brits-think-immigration-good-uk-000148479.html?guccounter=1',
        title: 'Most Brits think immigration is good for the UK',
        relatedTriplesCount: 0,
        relatedSentencesCount: 0
    }
    ,
    {
        sourceUrl: 'https://www.theguardian.com/uk-news/2019/jan/23/no-deal-brexit-incredibly-damaging-security-says-uk-counter-terror-head-neil-basu',
        sourceTitle: 'Far right may exploit Brexit tensions, says UK counter-terror chief',
        targetUrl: 'http://www.newindianexpress.com/opinions/2019/jan/15/did-south-asians-change-uks-destiny-1925264.html',
        targetTitle: 'Did south Asians change UK\'s destiny?- The New Indian Express',
        relatedTriplesCount: 7,
        relatedSentencesCount: 3
    }
    ,
    {
        url: 'https://www.nytimes.com/2019/01/23/realestate/house-hunting-in-ecuador.html',
        title: '',
        relatedTriplesCount: 0,
        relatedSentencesCount: 0
    }
    ,
    {
        url: 'https://www.thenational.ae/world/europe/british-muslim-loses-cemetery-court-battle-1.816633',
        title: 'British Muslim loses cemetery court battle',
        relatedTriplesCount: 0,
        relatedSentencesCount: 0
    }
    ,
    {
        sourceUrl: 'https://www.weeklyblitz.net/news/turkey-exporting-radical-islam-into-south-asia-under-the-garb-of-relief/',
        sourceTitle: 'Turkey exporting radical Islam into South Asia under the garb of relief',
        targetUrl: 'https://www.straitstimes.com/opinion/asias-history-lessons-for-the-worlds-future',
        targetTitle: 'Asia\'s history lessons for the world\'s future, Opinion News & Top Stories',
        relatedTriplesCount: 3,
        relatedSentencesCount: 3
    }
    ,
    {
        url: 'https://comicbook.com/marvel/2019/01/19/spider-man-far-from-home-crazy-rich-asians-star-remy-hii-role/',
        title: 'Who Is Remy Hii Playing in \'Spider-Man: Far From Home?\'',
        relatedTriplesCount: 0,
        relatedSentencesCount: 0
    }
    ,
    {
        url: 'https://religionnews.com/2018/12/04/chinas-repression-of-uighurs-wont-stop-until-the-international-community-intervenes/',
        title: 'China\'s repression of Uighurs won\'t stop until the international community intervenes',
        relatedTriplesCount: 0,
        relatedSentencesCount: 0
    }
    ,
    {
        sourceUrl: 'http://europa.eu/rapid/press-release_IP-18-6136_en.htm',
        sourceTitle: 'Global Partners for Global Challenges',
        targetUrl: 'http://www.pewresearch.org/fact-tank/2017/11/29/5-facts-about-the-muslim-population-in-europe/',
        targetTitle: '5 facts about the Muslim population in Europe',
        relatedTriplesCount: 2,
        relatedSentencesCount: 1
    }
    ,
    {
        sourceUrl: 'https://foreignpolicy.com/2018/11/28/china-is-violating-uighurs-human-rights-the-united-states-must-act/',
        sourceTitle: 'China Is Violating Uighurs\' Human Rights. The United States Must Act. – Foreign Policy',
        targetUrl: 'http://www.pewforum.org/2017/11/29/europes-growing-muslim-population/',
        targetTitle: 'Muslim Population Growth in Europe',
        relatedTriplesCount: 6,
        relatedSentencesCount: 3
    }
]

a.sort((x, y) => y.relatedSentencesCount - x.relatedSentencesCount)

for (let i = 0; i < 10; i ++) {
    utils.logFullObject(a[i])
}