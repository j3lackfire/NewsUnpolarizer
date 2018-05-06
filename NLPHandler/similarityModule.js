/**
 * Created by Le Pham Minh Duc on 10-Apr-18.
 */
/*
    This module will try to find the similarities between two articles
*/
const dbReader = require('./../LocalDB/dbReader')
const annotator = require('./annotator')

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
            comparisionList.forEach((element) => {
                element.similarDifferentRatio =
                    (element.uniqueSimilarDiscrete + element.uniqueSimilarDiscrete)
                    / (element.uniqueDifferentDiscrete+ element.uniqueDifferentAbstract)
            })
            //sort by b-a => biggest first / a - b => smallest first.
            comparisionList.sort((a, b) => {
                return (1 - a.similarDifferentRatio) - (1 -b.similarDifferentRatio)
            })

            //for case when the url exist in the db, the most relevance result will always be THAT article
            if (comparisionList[0].sourceUrl == comparisionList[0].targetUrl) {
                comparisionList.shift()
            }
            let returnList = []
            for (let i = 0; i < 5; i ++) {
                returnList.push(comparisionList[i])
            }
            console.log("Finish comparing function, return all the result")
            callback(null, returnList)
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
    let discrete_1 = _firstFeature.analyzedContent.discreteEntities
    let abstract_1 = _firstFeature.analyzedContent.abstractEntities

    let discrete_2 = _secondFeature.analyzedContent.discreteEntities
    let abstract_2 = _secondFeature.analyzedContent.abstractEntities

    let comparisionResult = {}
    //let just display the result first, so I don't get confust
    comparisionResult.targetTitle = _secondFeature.title
    comparisionResult.targetUrl = _secondFeature.url
    comparisionResult.targetSentiment = _secondFeature.analyzedContent.sentimentValue
    comparisionResult.sourceTitle = _firstFeature.title
    comparisionResult.sourceUrl = _firstFeature.url
    comparisionResult.sourceSentiment = _firstFeature.analyzedContent.sentimentValue
    //the ratio to compare between different and similarity
    comparisionResult.similarDifferentRatio = 1

    //similar stuffs
    comparisionResult.similarDiscrete = 0
    comparisionResult.uniqueSimilarDiscrete = 0
    comparisionResult.similarAbstract = 0
    comparisionResult.uniqueSimilarAbstract = 0
    //different stuffs
    comparisionResult.differentDiscreteCount = 0
    comparisionResult.differentAbstractCount = 0
    comparisionResult.uniqueDifferentDiscrete = 0
    comparisionResult.uniqueDifferentAbstract = 0
    //the array to store all the result in case we need it.
    comparisionResult.similarDiscreteEntities = []
    comparisionResult.similarAbstractEntities = []
    comparisionResult.differentDiscreteEntities = []
    comparisionResult.differentAbstractEntities = []

    for (let i = 0; i < discrete_1.length; i ++) {
        for (let j = 0; j < discrete_2.length; j ++) {
            if (discrete_1[i].text == discrete_2[j].text) {
                _addSimilarityResult(comparisionResult, discrete_1[i], discrete_2[j], true)
            }
        }
    }

    for (let i = 0; i < abstract_1.length; i ++) {
        for (let j = 0; j < abstract_2.length; j ++) {
            if (abstract_1[i].text == abstract_2[j].text) {
                _addSimilarityResult(comparisionResult, abstract_1[i], abstract_2[j], false)
            }
        }
    }

    discrete_1.forEach((element) => {
        _differentEntitiesHandler(comparisionResult, element, true, true)
    })

    abstract_1.forEach((element) => {
        _differentEntitiesHandler(comparisionResult, element, false, true)
    })

    discrete_2.forEach((element) => {
        _differentEntitiesHandler(comparisionResult, element, true, false)
    })

    abstract_2.forEach((element) => {
        _differentEntitiesHandler(comparisionResult, element, false, false)
    })
    callback(null, comparisionResult)
}

function _addSimilarityResult(_comparisionResult, _entity1, _entity2, _isDiscrete) {
    let newVal = {}
    newVal.text = _entity1.text
    newVal.ner = _entity1.ner
    newVal.sourceAppearIn = _entity1.appearIn
    newVal.targetAppearIn = _entity2.appearIn
    if (_isDiscrete) {
        _comparisionResult.similarDiscreteEntities.push(newVal)
        _comparisionResult.uniqueSimilarDiscrete ++
        _comparisionResult.similarDiscrete +=
            _entity1.timesAppear < _entity2.timesAppear ? _entity1.timesAppear : _entity2.timesAppear

    } else {
        _comparisionResult.similarAbstractEntities.push(newVal)
        _comparisionResult.uniqueSimilarAbstract ++
        _comparisionResult.similarAbstract +=
            _entity1.timesAppear < _entity2.timesAppear ? _entity1.timesAppear : _entity2.timesAppear
    }
}

function _differentEntitiesHandler(_comparisionResult, _entity, _isDiscrete, _isSourceArticle) {
    let comparingArray = _isDiscrete ?
        _comparisionResult.differentDiscreteEntities : _comparisionResult.differentAbstractEntities

    //FIRST, we have to check if the entity is not ALREADY inside the similar entities list
    if (_isEntityInArray(_comparisionResult.similarDiscreteEntities, _entity) ||
        _isEntityInArray(_comparisionResult.similarAbstractEntities, _entity) ) {
        return
    }

    if (!_isEntityInArray(comparingArray, _entity)) {
        let newVal = {}
        newVal.text = _entity.text
        newVal.ner = _entity.ner
        newVal.appearIn = _entity.appearIn
        newVal.appearInSource = _isSourceArticle
        comparingArray.push(newVal)
        if (_isDiscrete) {
            _comparisionResult.differentDiscreteCount += _entity.appearIn.length
            _comparisionResult.uniqueDifferentDiscrete ++
        } else {
            _comparisionResult.differentAbstractCount += _entity.appearIn.length
            _comparisionResult.uniqueDifferentAbstract ++
        }
    }
}

function _isEntityInArray(_entitiesArray, _entity) {
    for (let i = 0; i < _entitiesArray.length; i ++) {
        if (_entitiesArray[i].text == _entity.text)
            return true
    }
    return false
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
    callback(index >= 0 ? index : -1)
}

function _isArticleExist(_url, _allArticle, callback) {
    _getArticleExistingIndex(_url, _allArticle, (returnIndex) => {
        callback(returnIndex >= 0)
    })
}

module.exports.findSimilarArticles = findSimilarArticles



