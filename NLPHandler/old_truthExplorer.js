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
                console.log('\nCurrent entity target appear in')
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

let s = "U.S is dog. Meat is good? It is! this is random. LOL?"
let r = splitArticleIntoSentences(s)


for (let i = 0; i < r.length; i ++) {
    console.log(r[i])
}

module.exports.getGetMostSimilarArticleWithInsight = getGetMostSimilarArticleWithInsight