/**
 * Created by Le Pham Minh Duc on 08-Apr-18.
 */
//This function will be used to populate the database with a lot of news for the function to analyze
// The url of the article
const fs = require('fs') //file system to save the file

const paragraphAnnotator = require('./../NLPHandler/paragraphAnnotator')

let baseFilePath = __dirname + '/DB/'

let articleUrls = [
    'https://www.bangkokpost.com/news/world/1442427/japan-activates-first-marines-since-wwii',
    'http://www.scmp.com/news/asia/east-asia/article/2140707/japan-activates-first-marines-second-world-war-protect-islands',
    'https://www.forces.net/news/japan-activates-first-marine-unit-second-world-war',
    'https://www.rt.com/news/423474-japan-marines-force-ww2/',
    'https://www.dailystar.co.uk/news/world-news/694361/world-war-3-japan-china-amphibious-rapid-deployment-brigade-ww2',
    'https://www.cnbc.com/2018/04/07/japan-activates-first-marines-since-ww2-to-bolster-defenses-against-china.html',
    'http://gulfnews.com/news/asia/japan/japan-activates-first-marines-since-second-world-war-to-bolster-defences-against-china-1.2201283',
    'https://www.aljazeera.com/news/2018/04/japan-military-rising-marines-wwii-180407141942025.html',
    'https://www.sbs.com.au/news/japan-activates-first-marines-since-ww2',
    'http://www.business-standard.com/article/pti-stories/japan-launches-marines-unit-amid-china-s-growing-presence-118040700710_1.html',
    'https://www.thedailybeast.com/japan-activates-first-marine-unit-since-wwii',
    'https://www.express.co.uk/news/world/942703/World-War-3-Japan-North-Korea-China-military-threat',
    'https://www.independent.co.uk/news/world/asia/japan-first-marine-unit-second-world-war-east-china-sea-vulnerable-attack-a8293506.html'
]


function writeFile(fileName, content, callback) {
    // console.log(util.inspect(content, {showHidden: false, depth: null}))
    fs.writeFile(baseFilePath + fileName, JSON.stringify(content, null, 2), 'utf8',(err) => {
        if (err) {
            callback(err)
        } else {
            callback(null)
        }
    });
}

paragraphAnnotator.analyzeUrl(articleUrls[0], (err, res) => {
    if (err) {
        console.log(err)
    } else {
        // console.log(res)
        writeFile('myFile.json', res, (err) => {
            if (err) {
                console.log(err);
            }else {
                console.log('The file has been saved!');
            }
        })
    }
})