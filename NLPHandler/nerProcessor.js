/**
 * Created by Le Pham Minh Duc on 09-Oct-18.
 */
const nlpAnnotator = require('./nlpAnnotator')

//list about some particular entities like person, organization, city or country
let discreteNerList = [
    'PERSON',
    'LOCATION',
    'ORGANIZATION',
    'MISC',
    'CITY',
    'STATE_OR_PROVINCE',
    'COUNTRY'];

//list about abstract entities, not aim at one particular person like jobs, religion or things like that
let abstractNerList = [
    'RELIGION',
    'NATIONALITY',
    'TITLE', //Job title
    'IDEOLOGY',
    'CAUSE_OF_DEATH'] //violence, shooting ....

//these words are recognized by the algorithm under the PERSON category
//but we should not record them since they are just general word
let ignoreTextList = [
    'She', 'she', 'He', 'he', 'His', 'his', 'Her', 'her', 'Him', 'him',
    'They', 'they', 'Them', 'them', 'We', 'we', 'Us', 'us', 'I', 'Me', 'me'
]

//check if the entity is already inside the list or not.
function _isEntityAlreadyExist(entitiesList, entity) {
    for (let i = 0; i < entitiesList.length; i ++) {
        if (entitiesList[i].text == entity.text) {
            return true
        }
    }
    return false
}

//return true if it's people, organization and stuffs
//false if number and nonsense like that.
function _shouldSaveEntity(entity) {
    return (((discreteNerList.indexOf(entity.ner) != -1)
    || (abstractNerList.indexOf(entity.ner) != -1))
    && (ignoreTextList.indexOf(entity.text) == -1));
}

//check if that entity is individual entity or abstract entity
function isDiscreteEntity(entity) {
    return (discreteNerList.indexOf(entity.ner) != -1);
}

function _analyzeNerFromAnnotatedData(annotatedResult, callback) {
    let returnValue = {};
    let sentencesCount = annotatedResult.length;
    let charactersCount = 0
    let averageSentimentValue = 0;
    let entitiesList = [];
    //loop through every sentences
    for (let i= 0; i < sentencesCount; i ++) {
        charactersCount = +charactersCount + +annotatedResult[i].charactersCount
        averageSentimentValue = +averageSentimentValue + +annotatedResult[i].sentimentValue;
        //Check if the sentence have any Named entity,
        //Then,we should record it, as well as its sentiment value.
        //Loop through every entities inside the sentence
        for (let j = 0; j < annotatedResult[i].entities.length; j ++) {
            if (_shouldSaveEntity(annotatedResult[i].entities[j])) {
                if (_isEntityAlreadyExist(entitiesList, annotatedResult[i].entities[j])) {
                    for (let k = 0; k < entitiesList.length; k ++) {
                        if (entitiesList[k].text == annotatedResult[i].entities[j].text) {
                            //a little bit complicated to get the average sentiment value of the things.
                            let sum = entitiesList[k].sentimentValue * entitiesList[k].timesAppear;
                            sum = +sum + +annotatedResult[i].sentimentValue;
                            entitiesList[k].timesAppear ++;
                            entitiesList[k].sentimentValue = sum / entitiesList[k].timesAppear;
                            entitiesList[k].appearIn.push(i)
                        }
                    }
                } else {
                    let myEntity = {};
                    myEntity.text = annotatedResult[i].entities[j].text;
                    myEntity.ner = annotatedResult[i].entities[j].ner;
                    myEntity.sentimentValue = annotatedResult[i].sentimentValue;
                    myEntity.timesAppear = 1;
                    myEntity.appearIn = [];
                    myEntity.appearIn.push(i)
                    entitiesList.push(myEntity)
                }
            }
        }
    }

    let discreteEntities = []
    let abstractEntities = []

    for(let i = 0; i < entitiesList.length; i ++) {
        if (isDiscreteEntity(entitiesList[i])) {
            discreteEntities.push(entitiesList[i])
        } else {
            abstractEntities.push(entitiesList[i])
        }
    }
    averageSentimentValue = +averageSentimentValue / +sentencesCount;
    returnValue.sentimentValue = averageSentimentValue;

    returnValue.sentencesCount = sentencesCount;
    returnValue.charactersCount = charactersCount;

    returnValue.discreteEntities = discreteEntities;
    returnValue.abstractEntities = abstractEntities;

    callback(null, returnValue);
}

function analyzeNerFromParagraph(paragraph, callback) {
    nlpAnnotator.annotateParagraph(paragraph, function(error, response) {
        if (error) {
            callback(error, null)
        } else {
            _analyzeNerFromAnnotatedData(response, callback)
        }
    })

}

module.exports.analyzeNerFromParagraph = analyzeNerFromParagraph;

