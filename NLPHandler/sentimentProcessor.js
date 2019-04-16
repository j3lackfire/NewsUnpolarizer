/**
 * Created by Le Pham Minh Duc on 16-Apr-19.
 */
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


function extractSentimentsFromNLP(nlpAnnotation, callback) {
    let entitiesList = [];
    //loop through every sentences
    for (let i= 0; i < nlpAnnotation.length; i ++) {
        //Check if the sentence have any Named entity,
        //Then,we should record it, as well as its sentiment value.
        //Loop through every entities inside the sentence
        for (let j = 0; j < nlpAnnotation[i].entitymentions.length; j ++) {
            if (_shouldSaveEntity(nlpAnnotation[i].entitymentions[j])) {
                if (_isEntityAlreadyExist(entitiesList, nlpAnnotation[i].entitymentions[j])) {
                    for (let k = 0; k < entitiesList.length; k ++) {
                        if (entitiesList[k].text == nlpAnnotation[i].entitymentions[j].text) {
                            //a little bit complicated to get the average sentiment value of the things.
                            let sum = entitiesList[k].sentimentValue * entitiesList[k].timesAppear;
                            sum = +sum + +nlpAnnotation[i].sentimentValue;
                            entitiesList[k].timesAppear ++;
                            entitiesList[k].sentimentValue = sum / entitiesList[k].timesAppear;
                            entitiesList[k].appearIn.push(i)
                        }
                    }
                } else {
                    let myEntity = {};
                    myEntity.text = nlpAnnotation[i].entitymentions[j].text;
                    myEntity.ner = nlpAnnotation[i].entitymentions[j].ner;
                    myEntity.sentimentValue = nlpAnnotation[i].sentimentValue;
                    myEntity.timesAppear = 1;
                    myEntity.appearIn = [];
                    myEntity.appearIn.push(i)
                    entitiesList.push(myEntity)
                }
            }
        }
    }
    callback(null, entitiesList);
}


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

module.exports.extractSentimentsFromNLP = extractSentimentsFromNLP