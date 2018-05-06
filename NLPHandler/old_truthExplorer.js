/**
 * Created by Le Pham Minh Duc on 17-Apr-18.
 */
const similarityModule = require('./similarityModule')
const annotator = require('./annotator')
const webContentReader = require('./../NewsGetter/webContentReader')

/*
    The truth explorer (the name might be changed later)
    Is the tools to find contradiction in the articles.
    It works by looking at the most similar articles to the source article
    See which sentences that the "similar" work appear in, and maybe find the contradiction between them.
*/
/*
    This might not works, so I might as well just leave it here.
*/


function getGetMostSimilarArticleWithInsight(_sourceUrl, callback) {
    similarityModule.findSimilarArticles(_sourceUrl, (err_0, similarArticles) => {
        if (err_0) {
            console.log('Error happens when trying to find the similar article')
            callback(err_0, null)
        } else {
            let analyzedResult = similarArticles[0]
            webContentReader.extractWebContent(analyzedResult.sourceUrl, (err_1, article_1) => {
                webContentReader.extractWebContent(analyzedResult.targetUrl, (err_2, article_2) => {
                    if (err_1 || err_2) {
                        console.log('Error happens when trying to read the article from url')
                        callback(err_1 ? err_1 : err_2, null)
                    } else {
                        _processExtractedArticles(article_1.content, article_2.content, analyzedResult, callback)
                    }
                })
            } )
        }
    })
}

function _processExtractedArticles(article_1, article_2, analyzedResult, callback) {
    let sentenceList_1 = splitArticleIntoSentences(article_1)
    let sentenceList_2 = splitArticleIntoSentences(article_2)

    //recreated the result
    let returnVal = {}
    returnVal.sourceUrl = analyzedResult.sourceUrl
    returnVal.sourceTitle = analyzedResult.sourceTitle
    returnVal.sourceSentiment = analyzedResult.sourceSentiment
    returnVal.targetUrl = analyzedResult.targetUrl
    returnVal.targetTitle = analyzedResult.targetTitle
    returnVal.targetSentiment = analyzedResult.targetSentiment
    returnVal.similarDiscrete = 0
    returnVal.similarAbstract = 0
    returnVal.discreteEntities = []
    returnVal.abstractEntities = []

    for(let i = 0; i < analyzedResult.discreteEntities.length; i ++) {
        let currentEntity = analyzedResult.discreteEntities[i]
        let discreteVal = {}
        discreteVal.text = currentEntity.text
        discreteVal.ner = currentEntity.ner
        discreteVal.sourceSentences = []
        discreteVal.targetSentences = []
        for(let j = 0; j < currentEntity.sourceAppearIn.length; j ++) {
            if (currentEntity.sourceAppearIn[j] != 0 && currentEntity.sourceAppearIn[j] == currentEntity.sourceAppearIn[j - 1]) {
                continue
            } else {
                discreteVal.sourceSentences.push(sentenceList_1[currentEntity.sourceAppearIn[j]])
            }
        }
        for(let j = 0; j < currentEntity.targetAppearIn.length; j ++) {
            if (currentEntity.targetAppearIn[j] != 0 && currentEntity.targetAppearIn[j] == currentEntity.targetAppearIn[j - 1]) {
                continue
            } else {
                discreteVal.targetSentences.push(sentenceList_2[currentEntity.targetAppearIn[j]])
            }
        }
        returnVal.discreteEntities.push(discreteVal)
    }

    for(let i = 0; i < analyzedResult.abstractEntities.length; i ++) {
        let currentEntity = analyzedResult.abstractEntities[i]
        let abstractVal = {}
        abstractVal.text = currentEntity.text
        abstractVal.ner = currentEntity.ner
        abstractVal.sourceSentences = []
        abstractVal.targetSentences = []
        for(let j = 0; j < currentEntity.sourceAppearIn.length; j ++) {
            if (currentEntity.sourceAppearIn[j] != 0 && currentEntity.sourceAppearIn[j] == currentEntity.sourceAppearIn[j - 1]) {
                continue
            } else {
                abstractVal.sourceSentences.push(sentenceList_1[currentEntity.sourceAppearIn[j]])
            }
        }
        for(let j = 0; j < currentEntity.targetAppearIn.length; j ++) {
            if (currentEntity.targetAppearIn[j] != 0 && currentEntity.targetAppearIn[j] == currentEntity.targetAppearIn[j - 1]) {
                continue
            } else {
                abstractVal.targetSentences.push(sentenceList_2[currentEntity.targetAppearIn[j]])
            }
        }
        returnVal.abstractEntities.push(abstractVal)
    }
    callback(null, returnVal)
}

function splitArticleIntoSentences(_article) {
    // let dot = '. '
    // let question = '? '
    // let exclamation = '! '
    return _article.split(/[\\.!?]/)
}

module.exports.getGetMostSimilarArticleWithInsight = getGetMostSimilarArticleWithInsight



//------------- OLD AND UNUSED FUNCTION -------------
// ---------- BUT I DON'T WANT TO DELETE IT ----------
// ------- BECAUSE I SPENT SO MUCH TIME ON THIS -------
// ------- THIS IS FROM SIMILARITY MODULE
/*
 function findMostSimilarArticle(_coreFeatures, _allArticles, callback) {
 console.log('Finding most similar article from our local db')
 let discreteEntities = _coreFeatures.analyzedContent.discreteEntities
 let abstractEntities = _coreFeatures.analyzedContent.abstractEntities
 let mostSimilarDiscreteEntities = -1
 let mostSimilarAbstractEntities = -1
 let mostSimilarIndex = -1
 for (let articleIndex = 0; articleIndex < _allArticles.length; articleIndex ++) {
 if (_allArticles[articleIndex].url == _coreFeatures.url) {
 continue;
 }
 let thisArticle = _allArticles[articleIndex]
 let similarDiscrete = 0
 let similarAbstract = 0
 //Discrete entities list
 for (let i = 0; i < thisArticle.analyzedContent.discreteEntities.length; i ++) {
 for (let j = 0; j < discreteEntities.length; j ++) {
 if (thisArticle.analyzedContent.discreteEntities[i].text == discreteEntities[j].text) {
 //set that number to whichever smaller value.
 similarDiscrete += thisArticle.analyzedContent.discreteEntities[i].timesAppear < discreteEntities[j].timesAppear ?
 thisArticle.analyzedContent.discreteEntities[i].timesAppear : discreteEntities[j].timesAppear
 }
 }
 }
 //Abstract entities list
 for (let i = 0; i < thisArticle.analyzedContent.abstractEntities.length; i ++) {
 for (let j = 0; j < abstractEntities.length; j ++) {
 if (thisArticle.analyzedContent.abstractEntities[i].text == abstractEntities[j].text) {
 //set that number to whichever smaller value.
 similarAbstract += thisArticle.analyzedContent.abstractEntities[i].timesAppear < abstractEntities[j].timesAppear ?
 thisArticle.analyzedContent.abstractEntities[i].timesAppear : abstractEntities[j].timesAppear
 }
 }
 }
 if ((mostSimilarAbstractEntities + mostSimilarDiscreteEntities)
 < (similarAbstract + similarDiscrete)) {
 mostSimilarAbstractEntities = similarAbstract
 mostSimilarDiscreteEntities = similarDiscrete
 mostSimilarIndex = articleIndex
 }
 }
 console.log('FROM: ' + _coreFeatures.url)
 console.log('MOST SIMILAR: ' + _allArticles[mostSimilarIndex].url)
 callback(null, _allArticles[mostSimilarIndex])
 }
 */