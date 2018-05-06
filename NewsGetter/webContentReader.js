/**
 * Created by Le Pham Minh Duc on 03-Apr-18.
 */
/*
    Basically, extract the actually content of the news from the full html page.
    With all of their "suggestion" and useless stuffs.
    https://github.com/luin/readability
*/
/*
    Case this lib didn't read
    https://dailytrojan.com/2018/04/05/playing-politics-trump-uses-scare-tactics-to-distract-from-reality/
    the article is quite long but this tool only get the footer I think
*/
const read = require('node-readability');

//because they don't work with this extension
let blacklistWebsite = [
    'www.itv.com',
    'thehill.com',
    'dailytrojan.com'
]

getContentWithHtml('https://www.independent.co.uk/news/world/asia/japan-first-marine-unit-second-world-war-east-china-sea-vulnerable-attack-a8293506.html', (err,res) => {
    console.log(res)
})

function extractWebContent(url, callback) {
    if (_isWebsiteInBlacklist(url)) {
        callback('Website is inside blacklist, stop the program all-together', null)
        return
    }
    read(url, function(err, article, meta) {
        if (err) {
            callback(err, null)
        } else {
            let returnForm = {};
            returnForm.title = article.title;
            returnForm.content = _cleanUpResult(article.content)
            //if the returned function is too short, chance are, the web content reader can't really read it
            if (returnForm.content.length < 500) {
                console.log('\nThe content length was too short, mostly because the article is not gotten correctly')
                callback('Too short!', null)
            } else {
                callback(null, returnForm)
            }
        }
    })
}

function _isWebsiteInBlacklist(_url) {
    for (let i = 0; i < blacklistWebsite.length; i ++) {
        if (_url.includes(blacklistWebsite[i])) {
            return true
        }
    }
    return false
}

function getContentWithHtml(url, callback) {
    read(url, function(err, article, meta) {
        if (err) {
            callback(err, null)
        } else {
            callback(null, article.content)
        }
    })
}

function getContentNoCleanUp(url, callback) {
    read(url, function(err, article, meta) {
        if (err) {
            callback(err, null)
        } else {
            let returnForm = {};
            returnForm.title = article.title;
            returnForm.content = _removeHtmlTags(article.content)
            console.log(_removeHtmlTags(article.content))
            callback(null, returnForm)
        }
    })
}

/*
We need clean up because stanford nlu just remove all white space, which make some sentences wrong.
The reason for adding all of the '.' is because in web paragraph, there are a lot of sentences that
will not have proper sentence ending. Because they are usually separated by images or line ending.

For example, some header like: Yo, this is an image, without dot or something, will be matched to the next
sentences, thus, make a wrong paragraph.
Ehh, this is good enough anyway, will try to intergrate it into the project tomorrow
*/
function _cleanUpResult(content) {
    let t1 = _removeHtmlTags(content);
    t1 = _removeExtraSpace(t1);
    t1 = _removeExtraLines(t1);
    //because of the way I clean up, there will always be one single DOT at the start of the article
    //which cause one extra neutral sentiment to the algorithm.
    console.log(_removeExtraDot(t1.replace('.', ' ')))
    return _removeExtraDot(t1.replace('.', ' '));
}

//Google keyword search: remove html tag from text.
//Get content inside html tag.
//https://stackoverflow.com/questions/822452/strip-html-from-text-javascript
function _removeHtmlTags(content) {
    return content.replace(/<(?:.|\n)*?>/gm, ' ');
}

function _removeExtraSpace(content) {
    // return content.replace(/\s^\n/g,' ').trim();
    return content.replace(/\s{2,}/g, ' . ');
}

function _removeExtraLines(content) {
    return content.replace(/\n+/g, ' . '); //this part remove the extra lines
}

//because in HTML content, all the QUOTE (") is \" so we have to change these as well
//No need for this function it seems, Only POSTMAN displayed it wrongly
// function _removeSlash(content) {
//     console.log('Remove slash!!!')
//     console.log(content)
//     return content.replace(/\\/, '');
// }

function _removeExtraDot(content) {
    return content.split('. .').join('.')
}

module.exports.extractWebContent = extractWebContent;
module.exports.getContentNoCleanUp = getContentNoCleanUp;
module.exports.getContentWithHtml = getContentWithHtml;