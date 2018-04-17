/**
 * Created by Le Pham Minh Duc on 10-Apr-18.
 */
/*
    This module will try to find the similarities between two articles
*/
const dbReader = require('./../LocalDB/dbReader')
const annotator = require('./annotator')

let url_1 = 'https://www.reviewjournal.com/news/politics-and-government/nevada/woman-says-las-vegas-gop-campaign-adviser-made-her-his-sex-slave/'

//-----------------------------------------------------------------------

//Call this function from outside.
//This function will get the core features of
function findSimilarArticles(_url, callback) {
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
                        _getSimilarityArticlesList(features, allArticles, callback)
                    })
                } else {
                    console.log('Annotating the article')
                    annotator.analyzeUrl(_url, (error, coreFeatures) => {
                        if (error) {
                            console.log('Error when getting core features of an url')
                            callback(error, null)
                        } else {
                            _getSimilarityArticlesList(coreFeatures, allArticles, callback)
                        }
                    })
                }
            })
        }
    })
}

function _getSimilarityArticlesList(_feature, _allArticles, callback) {
    console.log('Loop through the whole articles database and get the list of all similar article')
    _generateComparisionList(_feature, _allArticles, [], (err, comparisionList) => {
        if (err) {
            callback(err, null)
        } else {
            comparisionList.sort((a, b) => {
                return (b.similarDiscrete + b.similarAbstract) - (a.similarDiscrete + a.similarAbstract)
            })
            //for case when the url exist in the db, the most relevance result will always be THAT article
            //make sense, eh ?
            if (comparisionList[0].sourceUrl == comparisionList[0].targetUrl) {
                comparisionList.shift()
            }
            callback(null, comparisionList)
        }
    })
}

//we need to loop through all of the article, rank their similarity to the base article and
function _generateComparisionList(_feature, _allArticle, _comparisionList, callback) {
    let index = _comparisionList.length
    let comparisionList = _comparisionList
    _compareArticles(_feature, _allArticle[index], (err, comparisionValue) => {
        if (err) {
            console.log('Error happen during generating comparision list')
            callback(err, null)
        } else {
            comparisionList.push(comparisionValue)
            if (comparisionList.length == _allArticle.length) {
                callback(null, comparisionList)
            } else {
                _generateComparisionList(_feature, _allArticle, comparisionList, callback)
            }
        }
    })
}

//Get the similarity between two articles
function _compareArticles(_firstFeature, _secondFeature, callback) {

    let discrete_1 = _firstFeature.analyzedContent.discreteEntitiesList
    let abstract_1 = _firstFeature.analyzedContent.abstractEntitiesList

    let discrete_2 = _secondFeature.analyzedContent.discreteEntitiesList
    let abstract_2 = _secondFeature.analyzedContent.abstractEntitiesList

    let returnVal = {}
    returnVal.sourceUrl = _firstFeature.url
    returnVal.sourceTitle = _firstFeature.title
    returnVal.sourceSentiment = _firstFeature.analyzedContent.sentimentValue

    returnVal.targetUrl = _secondFeature.url
    returnVal.targetTitle = _secondFeature.title
    returnVal.targetSentiment = _secondFeature.analyzedContent.sentimentValue

    returnVal.similarDiscrete = 0
    returnVal.similarAbstract = 0

    returnVal.discreteEntities = []
    returnVal.abstractEntities = []

    for (let i = 0; i < discrete_1.length; i ++) {
        for (let j = 0; j < discrete_2.length; j ++) {
            if (discrete_1[i].text == discrete_2[j].text) {
                let similarities = {}
                similarities.text = discrete_1[i].text
                similarities.ner = discrete_1[i].ner
                similarities.sourceAppearIn = discrete_1[i].appearIn
                similarities.targetAppearIn = discrete_2[j].appearIn
                returnVal.discreteEntities.push(similarities)
                returnVal.similarDiscrete +=  discrete_1[i].timesAppear < discrete_2[j].timesAppear ? discrete_1[i].timesAppear : discrete_2[j].timesAppear
                break
            }
        }
    }

    for (let i = 0; i < abstract_1.length; i ++) {
        for (let j = 0; j < abstract_2.length; j ++) {
            if (abstract_1[i].text == abstract_2[j].text) {
                let similarities = {}
                similarities.text = abstract_1[i].text
                similarities.ner = abstract_1[i].ner
                similarities.sourceAppearIn = abstract_1[i].appearIn
                similarities.targetAppearIn = abstract_2[j].appearIn
                returnVal.abstractEntities.push(similarities)
                returnVal.similarAbstract +=  abstract_1[i].timesAppear < abstract_2[j].timesAppear ? abstract_1[i].timesAppear : abstract_2[j].timesAppear
                break
            }
        }
    }

    callback(null, returnVal)
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

module.exports.findSimilarArticles = findSimilarArticles






//------------- OLD AND UNUSED FUNCTION -------------
// ---------- BUT I DON'T WANT TO DELETE IT ----------
// ------- BECAUSE I SPENT SO MUCH TIME ON THIS -------

/*
function findMostSimilarArticle(_coreFeatures, _allArticles, callback) {
    console.log('Finding most similar article from our local db')
    let discreteEntitiesList = _coreFeatures.analyzedContent.discreteEntitiesList
    let abstractEntitiesList = _coreFeatures.analyzedContent.abstractEntitiesList
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
*/