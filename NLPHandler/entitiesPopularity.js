/**
 * Created by Le Pham Minh Duc on 26-Apr-18.
 */
const dbReader = require('./../LocalDB/dbReader')

_getEntitiesPopularity((err,res) => {
    _sortEntitiesByPopularity(res, () => {})
})

function _getEntitiesPopularity(callback) {
    dbReader.readEntitiesPopularity((err, entitiesPopularity) => {
        if (err) {
            console.log('Error reading entities popularity from DB')
            callback(err, null)
        } else {
            callback(null, entitiesPopularity)
        }
    })
}

function _sortEntitiesByPopularity(_entitiesList, callback) {
    let timesAppearArray = []
    let articleAppearArray = []
    for (let i = 0; i < _entitiesList.length; i ++) {
        if (timesAppearArray.indexOf(_entitiesList[i].timesAppear) == -1) {
            timesAppearArray.push(_entitiesList[i].timesAppear)
        }
        if (articleAppearArray.indexOf(_entitiesList[i].articleAppear) == -1) {
            articleAppearArray.push(_entitiesList[i].articleAppear)
        }
    }
    timesAppearArray.sort()
    articleAppearArray.sort()
}

function _getMedian(_sortedArray) {
    if (_sortedArray.length % 2 != 0) {
        console.log("----1")
        return _sortedArray[(_sortedArray.length - 1)/2]
    } else {
        console.log("----2")
        console.log(_sortedArray.length+1)
        return (_sortedArray[_sortedArray.length/2] + _sortedArray[_sortedArray.length/2-1])/2
    }
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