/**
 * Created by Le Pham Minh Duc on 03-Apr-18.
 */
/*
    Basically, extract the actually content of the news from the full html page.
    With all of their "suggestion" and useless stuffs.
    https://github.com/luin/readability
*/
var read = require('node-readability');

function extractWebContent(url, callback) {
    read(url, function(err, article, meta) {
        if (err) {
            callback(err, null)
        } else {
            let returnForm = {};
            returnForm.title = article.title;
            returnForm.content = _cleanUpResult(article.content)
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
    return _removeExtraDot(t1.replace('.', ' '));
}

//Google keyword search: remove html tag from text.
//Get content inside html tag.
//https://stackoverflow.com/questions/822452/strip-html-from-text-javascript
function _removeHtmlTags(content) {
    return content.replace(/<(?:.|\n)*?>/gm, '');
}

function _removeExtraSpace(content) {
    // return content.replace(/\s^\n/g,' ').trim();
    return content.replace(/\s{2,}/g, ' . ');
}

function _removeExtraLines(content) {
    return content.replace(/\n+/g, ' . ');
}

function _removeExtraDot(content) {
    return content.split('. .').join('.')
}

module.exports.extractWebContent = extractWebContent;