/**
 * Created by Le Pham Minh Duc on 05-Oct-18.
 */
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
