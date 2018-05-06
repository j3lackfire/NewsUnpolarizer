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
            comparisionList.sort((a, b) => {
                return (b.similarDiscrete + b.similarAbstract) - (a.similarDiscrete + a.similarAbstract)
            })
            //for case when the url exist in the db, the most relevance result will always be THAT article
            //make sense, eh ?
            if (comparisionList[0].sourceUrl == comparisionList[0].targetUrl) {
                comparisionList.shift()
            }
            let returnList = []
            for (let i = 0; i < 5; i ++) {
                returnList.push(comparisionList[i])
            }
            console.log("\n\nReturn all the value!!!")
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

    console.log("\n\nCompare between two articles:")
    console.log(_firstFeature.title)
    console.log(_secondFeature.title)

    let discrete_1 = _firstFeature.analyzedContent.discreteEntities
    let abstract_1 = _firstFeature.analyzedContent.abstractEntities

    let discrete_2 = _secondFeature.analyzedContent.discreteEntities
    let abstract_2 = _secondFeature.analyzedContent.abstractEntities

    let comparisionResult = {}
    comparisionResult.sourceUrl = _firstFeature.url
    comparisionResult.sourceTitle = _firstFeature.title
    comparisionResult.sourceSentiment = _firstFeature.analyzedContent.sentimentValue

    comparisionResult.targetUrl = _secondFeature.url
    comparisionResult.targetTitle = _secondFeature.title
    comparisionResult.targetSentiment = _secondFeature.analyzedContent.sentimentValue

    comparisionResult.similarDiscrete = 0
    comparisionResult.uniqueSimilarDiscrete = 0
    comparisionResult.similarAbstract = 0
    comparisionResult.uniqueSimilarAbstract = 0

    comparisionResult.differentDiscreteCount = 0
    comparisionResult.differentAbstractCount = 0
    comparisionResult.uniqueDifferentDiscrete = 0
    comparisionResult.uniqueDifferentAbstract = 0

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

    for (let i = 0; i < discrete_1.length; i ++) {
        for (let j = 0; j < discrete_2.length; j ++) {
            _differentEntitiesHandler(comparisionResult, discrete_1[i], discrete_2[j], true)
        }
    }

    for (let i = 0; i < abstract_1.length; i ++) {
        for (let j = 0; j < abstract_2.length; j ++) {
            _differentEntitiesHandler(comparisionResult, abstract_1[i], abstract_2[j], false)
        }
    }

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

function _differentEntitiesHandler(_comparisionResult, _entity1, _entity2, _isDiscrete) {
    let comparingArray = _isDiscrete ?
        _comparisionResult.differentDiscreteEntities : _comparisionResult.differentDiscreteEntities

    //FIRST, we have to check if the entity is not ALREADY inside the similar entities list
    if (_isEntityInArray(_comparisionResult.similarDiscreteEntities, _entity1) ||
        _isEntityInArray(_comparisionResult.similarAbstractEntities, _entity2)) {
        return
    }

    if (!_isEntityInArray(comparingArray, _entity1)) {
        let newVal = {}
        newVal.text = _entity1.text
        newVal.ner = _entity1.ner
        newVal.appearIn = _entity1.appearIn
        newVal.appearInSource = true
        comparingArray.push(newVal)
        if (_isDiscrete) {
            _comparisionResult.differentDiscreteCount += _entity1.appearIn.length
            _comparisionResult.uniqueDifferentDiscrete ++
        } else {
            _comparisionResult.differentAbstractCount += _entity1.appearIn.length
            _comparisionResult.uniqueDifferentAbstract ++
        }
    }

    if (!_isEntityInArray(comparingArray, _entity2)) {
        // console.log("_isEntityInArray " + _entity2.text)
        // if (_entity2.text == 'Beijing') {
        //     console.log("\n\n\nIt's fucking beijing\n\n\n")
        //     console.log(comparingArray)
        // }
        let newVal = {}
        newVal.text = _entity2.text
        newVal.ner = _entity2.ner
        newVal.appearIn = _entity1.appearIn
        newVal.appearInSource = true
        comparingArray.push(newVal)
        if (_isDiscrete) {
            _comparisionResult.differentDiscreteCount += _entity2.appearIn.length
            _comparisionResult.uniqueDifferentDiscrete ++
        } else {
            _comparisionResult.differentAbstractCount += _entity2.appearIn.length
            _comparisionResult.uniqueDifferentAbstract ++
        }
    }
}

function _isEntityInArray(_entitiesArray, _entity) {
    for (let i = 0; i < _entitiesArray.length; i ++) {
        if (_entitiesArray[i].text == _entity.text) {
            return true
        }
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