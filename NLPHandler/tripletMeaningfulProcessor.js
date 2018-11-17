/**
 * Created by Le Pham Minh Duc on 07-Nov-18.
 */
/* List of all the possible word position in sentence
 https://stackoverflow.com/questions/1833252/java-stanford-nlp-part-of-speech-labels
 CC Coordinating conjunction
 CD Cardinal number
 DT Determiner
 EX Existential there
 FW Foreign word
 IN Preposition or subordinating conjunction
 JJ Adjective
 JJR Adjective, comparative
 JJS Adjective, superlative
 LS List item marker
 MD Modal
 NN Noun, singular or mass
 NNS Noun, plural
 NNP Proper noun, singular
 NNPS Proper noun, plural
 PDT Predeterminer
 POS Possessive ending
 PRP Personal pronoun
 PRP$ Possessive pronoun
 RB Adverb
 RBR Adverb, comparative
 RBS Adverb, superlative
 RP Particle
 SYM Symbol
 TO to
 UH Interjection
 VB Verb, base form
 VBD Verb, past tense
 VBG Verb, gerund or present participle
 VBN Verb, past participle
 VBP Verb, non­3rd person singular present
 VBZ Verb, 3rd person singular present
 WDT Wh­determiner
 WP Wh­pronoun
 WP$ Possessive wh­pronoun
 WRB Wh­adverb */

/*
For this paragraph:
"Over the past few years, unprecedented numbers of immigrants have left Muslim-majority countries to come to Europe, fleeing the carnage in Syria and the turmoil across North Africa. They join previous waves of muslim immigrants, many of whom who are not integrating well. In a project they documented in Why Muslim Integration Fails in Christian-Heritage Societies, IPL co-director David Laitin, IPL faculty affiliate Claire Adida, and Marie-Anne Valfort trace the roots of this failed integration in France and across Europe more broadly. Two immigrants who are alike in every single way except for their religious identity will integrate very differently within their host societies. By studying a population of Senegalese Christian and Muslim immigrants from the Serer and Joola religiously mixed communities who migrated to France under identical conditions, they found that Muslim immigrants face greater discrimination in the labor market, earn less monthly income, express less attachment to their host country, and exhibit greater attachment to their country of origin than do their Christian counterparts. These patterns do not improve in subsequent generations. The cause of this failure of integration is twofold: Islamophobia on the part of French society and Muslim immigrants' tendency to identify more with their home communities in response. As a result, Europe is creating a class of under-employed immigrants who feel little or no connection with their host societies. The researchers sent similar resumés of three applicants to French firms. All three were French citizens with secondary school degrees and several years of experience in middle-class jobs. By their names, employers could tell that one was Christian Senegalese, one was Muslim Senegalese, and the third was a native French person. One Senegalese applicant, randomly assigned to the Muslim or Christian name, was matched with the native French applicant for each job. Employers were two and a half times more likely to offer the Christian an interview than the Muslim. In experimental games conducted in Paris' nineteenth district where Serers and Joolas interacted with native French subjects, they once again found that the French exhibit a gratuitous distaste for Muslims, more so than they do for Senegalese Christians. When given the opportunity to withhold money from other people in the experiment, native French subjects were more likely to do so with Senegalese Muslims than with Senegalese Christians. In a survey of 511 Muslim and Christian Serers and Joola living in France, the researchers found that on average, Muslim Serer and Joola families earned 400 euros, or about 15 percent of an average French income, less per month than their Christian counterparts. In other words, there was clear anti-Muslim discrimination in the competition for a middle-class job, which had significant implications for Muslims' prospects of attaining a middle-class lifestyle. There is egregious discrimination in the French labor market. This discrimination led the study's Muslim respondents to view French institutions with much greater distrust than their Christian counterparts. The Muslim respondents were more likely to send remittances back to Senegal and to plan to be buried there. How can this vicious circle of discrimination and distrust be broken? Small nudges, such as publicizing discrimination rates, can raise awareness and reduce discrimination. The researchers note, Muslim communities can do more to encourage gender equality and other norms of their host societies, for example, by shaming community members who refuse to take orders from women. On a macro level, firms should scrutinize their own hiring practices. They should also consider hiring consultants who can help them address tensions that arise due to workplace conflicts related to religion. The one thing countries shouldn't do is ban immigration. Such policies are directed at the wrong targets; they are also counter-productive. They do not tackle the discrimination Muslims face when trying to integrate into their host societies, and they may even exacerbate the failure of Muslim integration by encouraging Muslims to withdraw. Alienating Muslims also comes at a cost to public security, the researchers note. After the Paris attacks of November 13, 2015, in which 130 people died, French authorities closed the country's borders and launched a manhunt for the plot's mastermind, Abdelhamid Abaaoud. The informant who tipped off French authorities about his location? A fellow Muslim."
This processor reduce the number of triplets (total) from 199 to 177. Not really effective I would say.
*/
const utils = require('./../utils')

function filterOpenieResult(openieResult, callback) {
    let returnList = []
    for (let i = 0; i < openieResult.length; i ++) {
        let currentSentence = {}
        currentSentence.triplets = []
        let currentOpenie = openieResult[i]
        let tokenList = currentOpenie.tokens
        for (let j = 0; j < currentOpenie.triplets.length; j ++) {
            let currentTriplet = currentOpenie.triplets[j]
            let relationVerb = _getRelationVerb(currentTriplet, tokenList)
            if (relationVerb != null) {
                currentTriplet.relationVerb = relationVerb
                currentSentence.triplets.push(currentTriplet)
            }
        }
        currentSentence.text = ""
        for (let j = 0; j < tokenList.length; j ++) {
            currentSentence.text += tokenList[j].word + " "
        }
        returnList.push(currentSentence)
    }
    callback(returnList)
}

function _getRelationVerb(_triplet, _tokenList) {
    let relationTokensIndex = _getContainingTokenIndexList(_triplet.relation, _tokenList)
    for (let i = 0; i < relationTokensIndex.length; i ++) {
        let currentToken = _tokenList[relationTokensIndex[i]]
        if (currentToken.pos.includes("VB") && currentToken.lemma != 'be') {
            return currentToken.lemma
        }
    }
    return null
}

// a list of [22, 25] is expected to return 22, 23, 24 and 25
// the displaying INDEX in their json response start from 1, so this will be 1 off
// but because we only use this value to get from their return array, which start from 0,
// this works and look less messy
function _getContainingTokenIndexList(_text, _tokenList) {
    let returnList = []
    let textList = _text.split(' ')
    for (let i = 0; i < textList.length; i ++) {
        for (let j = 0; j < _tokenList.length; j ++) {
            if (textList[i] == _tokenList[j].word) {
                returnList.push(j)
                break
            }
        }
    }
    return returnList
}

module.exports.filterOpenieResult = filterOpenieResult
