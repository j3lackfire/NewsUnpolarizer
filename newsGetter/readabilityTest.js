/**
 * Created by Le Pham Minh Duc on 03-Apr-18.
 */
/*
    Basically, extract the actually content of the news from the full html page.
    https://github.com/luin/readability
*/
//Need clean up because stanford nlu just remove all white space, which make some sentences wrong.
//For example, some header like: Yo, this is an image, without dot or something, will be matched to the next
//sentences, thus, make a wrong paragraph.
//Ehh, this is good enough anyway, will try to intergrate it into the project tomorrow
var read = require('node-readability');

read('http://www.bbc.com/news/world-europe-43617033',function(err, article, meta) {
    // Title
    // console.log(article.title);
    // console.log('\n\n');
    // console.log(_cleanUpResult(article.content))
    console.log(_removeHtmlTags(article.content))
    // Close article to clean up jsdom and prevent leaks
    article.close();
});

function _cleanUpResult(content) {
    let t1 = _removeHtmlTags(content);
    t1 = _removeExtraSpace(t1);
    t1 = _removeExtraLines(t1);
    return _removeExtraDot(t1);
}

//Google keyword search: remove html tag from text.
//Get content inside html tag.
//https://stackoverflow.com/questions/822452/strip-html-from-text-javascript
function _removeHtmlTags(content) {
    return content.replace(/<(?:.|\n)*?>/gm, '');
}

//remove all white character except \n
function _removeExtraSpace(content) {
    // return content.replace(/\s^\n/g,' ').trim();
    return content.replace(/\s{2,}/g, ' .');
}

function _removeExtraLines(content) {
    return content.replace(/\n+/g, ' .');
}

function _removeExtraDot(content) {
    return content.split('. .').join('.')
}