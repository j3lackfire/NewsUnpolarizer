/**
 * Created by Le Pham Minh Duc on 10-Apr-18.
 */
/*
    This module will try to find the similarities between two articles
*/
const dbReader = require('./../LocalDB/dbReader')
const annotator = require('./annotator')

// findSimilarArticlesToUrl('https://www.bangkokpost.com/news/world/1442427/japan-activates-first-marines-since-wwii', (err, res) => {
//     console.log('The most similar article are')
//     console.log(res)
// })

//Call this function from outside.
//This function will get the core features of
function findSimilarArticlesToUrl(_url, callback) {
    console.log('Trying to find similar article to the one from URL')
    _getAllArticle((err, allArticles) => {
        if (err) {
            callback(err, null)
        } else {
            console.log('All articles loaded, start comparing...')
            _isArticleExist(_url, allArticles,(isExist) => {
                if (isExist) {
                    console.log('Article exist in local db, load it and do function')
                    _getArticleCoreFeatureByUrl(_url, allArticles, (features) => {
                        findMostSimilarArticle(features, allArticles, callback)
                    })
                } else {
                    console.log('Annotating the article')
                    annotator.analyzeUrl(_url, (error, coreFeatures) => {
                        if (error) {
                            console.log('Error when getting core features of an url')
                            callback(error, null)
                        } else {
                            findMostSimilarArticle(coreFeatures, allArticles, callback)
                        }
                    })
                }
            })
        }
    })
}

function findMostSimilarArticle(_coreFeatures, _allArticles, callback) {
    console.log('Finding most similar article from our local db')
    let discreteEntitiesList = _coreFeatures.analyzedContent.discreteEntitiesList
    let abstractEntitiesList = _coreFeatures.analyzedContent.discreteEntitiesList
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
        for (let i = 0; i < thisArticle.analyzedContent.discreteEntitiesList.length; i ++) {
            for (let j = 0; j < discreteEntitiesList.length; j ++) {
                if (thisArticle.analyzedContent.discreteEntitiesList[i].text == discreteEntitiesList[j].text) {
                    //set that number to whichever smaller value.
                    similarDiscrete += thisArticle.analyzedContent.discreteEntitiesList[i].timesAppear < discreteEntitiesList[j].timesAppear ?
                        thisArticle.analyzedContent.discreteEntitiesList[i].timesAppear : discreteEntitiesList[j].timesAppear
                }
            }
        }
        //Abstract entities list
        for (let i = 0; i < thisArticle.analyzedContent.abstractEntitiesList.length; i ++) {
            for (let j = 0; j < abstractEntitiesList.length; j ++) {
                if (thisArticle.analyzedContent.abstractEntitiesList[i].text == abstractEntitiesList[j].text) {
                    //set that number to whichever smaller value.
                    similarAbstract += thisArticle.analyzedContent.abstractEntitiesList[i].timesAppear < abstractEntitiesList[j].timesAppear ?
                        thisArticle.analyzedContent.abstractEntitiesList[i].timesAppear : abstractEntitiesList[j].timesAppear
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

function _getArticleCoreFeatureByUrl(_url, _allArticles, callback) {
    let index = -1
    for (let i = 0; i < _allArticles.length; i ++) {
        if (_allArticles[i].url == _url) {
            index = i
            break
        }
    }
    if (index >= 0) {
        callback(_allArticles[index])
    } else {
        console.log('Article not exist inside the local db. Why does a function call it?????')
        callback(null)
    }
}

function _getAllArticle(callback) {
    dbReader.readDbAsJson((err, response) => {
        if(err) {
            console.log('Error getting the articles from DB: ' + err)
            callback(err, null)
        } else {
            callback(null, response)
        }
    })
}

//return null if the article not exist
function _getArticleExistingIndex(_url, _allArticles, callback) {
    let index = -1
    for (let i = 0; i < _allArticles.length; i ++) {
        if (_allArticles[i].url == _url) {
            index = i
            break
        }
    }
    if (index >= 0) {
        callback(index)
    } else {
        callback(-1)
    }
}

function _isArticleExist(_url, _allArticle, callback) {
    _getArticleExistingIndex(_url, _allArticle, (returnIndex) => {
        callback(returnIndex >= 0)
    })
}

module.exports.findSimilarArticlesToUrl = findSimilarArticlesToUrl