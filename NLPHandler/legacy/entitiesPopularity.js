/**
 * Created by Le Pham Minh Duc on 26-Apr-18.
 */
const dbReader = require('./../../LocalDB/dbReader')

// _getEntitiesPopularity((err, entitiesPopularity, metaData) => {
//     console.log(metaData)
// })

//to calculate the median, in this case, it's neccesary to remove all of the "1" result because if not
//all the median value will be just 1
function _getEntitiesPopularity(callback) {
    dbReader.readEntitiesPopularity((err, entitiesPopularity) => {
        if (err) {
            console.log('Error reading entities popularity from DB')
            callback(err, null, null)
        } else {
            let popularityInfo = {}
            popularityInfo.entitiesNumber = entitiesPopularity.length
            let timesAppearTotal = 0
            let articleAppearTotal = 0

            let timesAppearArray = []
            let articleAppearArray = []
            for (let i = 0; i < entitiesPopularity.length; i ++) {
                if (entitiesPopularity[i].timesAppear != 1) {
                    timesAppearArray.push(entitiesPopularity[i].timesAppear)
                }
                timesAppearTotal += entitiesPopularity[i].timesAppear

                if (entitiesPopularity[i].articleAppear != 1) {
                    articleAppearArray.push(entitiesPopularity[i].articleAppear)
                }
                articleAppearTotal += entitiesPopularity[i].articleAppear

                if (entitiesPopularity[i].timesAppearRank == 0) {
                    popularityInfo.highestTimesAppear = entitiesPopularity[i].timesAppear
                }
                if (entitiesPopularity[i].articleAppearRank == 0) {
                    popularityInfo.highestArticlesAppear = entitiesPopularity[i].articleAppear
                }
            }

            timesAppearArray.sort((a,b) => a - b)
            popularityInfo.timesApppearTotal = timesAppearTotal
            popularityInfo.timesApppearAvg = timesAppearTotal / entitiesPopularity.length
            popularityInfo.timesAppearMedian = _getMedian(timesAppearArray)

            articleAppearArray.sort((a,b) => a - b)
            popularityInfo.articleAppearTotal = articleAppearTotal
            popularityInfo.articleAppearAvg = articleAppearTotal / entitiesPopularity.length
            popularityInfo.articleAppearMedian = _getMedian(articleAppearArray)

            callback(null, entitiesPopularity, popularityInfo)
        }
    })
}

function _getMedian(_sortedArray) {
    if (_sortedArray.length % 2 != 0) {
        return _sortedArray[(_sortedArray.length - 1)/2]
    } else {
        console.log(_sortedArray.length+1)
        return (_sortedArray[_sortedArray.length/2] + _sortedArray[_sortedArray.length/2-1])/2
    }
}

function _getMainEntity(_coreFeatures, _allEntitiesPopularity, callback) {
    let similarityScore = 0
    let differenceScore = 0
}

//----- DB initializer functions -------------

function checkAndUpdateEntitiesInfo(_entitiesList, _entitiesPopularity) {
    for (let i = 0; i < _entitiesList.length; i ++) {
        //not exist
        let myIndex = _getEntityIndex(_entitiesList[i], _entitiesPopularity)
        if (myIndex == -1) {
            let newEntry = {}
            newEntry.text = _entitiesList[i].text
            newEntry.ner = _entitiesList[i].ner
            newEntry.timesAppear = _entitiesList[i].timesAppear
            newEntry.articleAppear = 1
            _entitiesPopularity.push(newEntry)
        } else {
            _entitiesPopularity[myIndex].timesAppear += _entitiesList[i].timesAppear
            _entitiesPopularity[myIndex].articleAppear ++
        }
    }
}

function updateAndRankEntitiesPopularity(_entitiesList) {
    //number
    let timesAppearArray = [] //the total entities appearance by number
    let articleAppearArray = [] //entities appearance count by article
    for (let i = 0; i < _entitiesList.length; i ++) {
        if (timesAppearArray.indexOf(_entitiesList[i].timesAppear) == -1) {
            timesAppearArray.push(_entitiesList[i].timesAppear)
        }
        if (articleAppearArray.indexOf(_entitiesList[i].articleAppear) == -1) {
            articleAppearArray.push(_entitiesList[i].articleAppear)
        }
    }
    timesAppearArray.sort((a,b) => a - b)
    articleAppearArray.sort((a,b) => a - b)
    for (let i = 0; i < _entitiesList.length; i ++) {
        _entitiesList[i].timesAppearRank = timesAppearArray.length - timesAppearArray.indexOf(_entitiesList[i].timesAppear) - 1
        _entitiesList[i].articleAppearRank = articleAppearArray.length - articleAppearArray.indexOf(_entitiesList[i].articleAppear) - 1
    }
}

function _getEntityIndex(entity, entityList) {
    for (let i = 0; i < entityList.length; i ++) {
        if (entityList[i].text == entity.text) {
            return i
        }
    }
    return -1
}

module.exports.checkAndUpdateEntitiesInfo = checkAndUpdateEntitiesInfo
module.exports.updateAndRankEntitiesPopularity = updateAndRankEntitiesPopularity