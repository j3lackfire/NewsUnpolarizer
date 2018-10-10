/**
 * Created by Le Pham Minh Duc on 10-Oct-18.
 */
const utils = require('./../utils')
const nlpAnnotator = require('./nlpAnnotator')

function analyzeOpenIeFromParagraph(paragraph, callback) {
    nlpAnnotator.requestNlpAnnotation(paragraph, (error, response, body) => {
        if (error) {
            console.log("ERROR Annotating the paragraph!!!!!!!!!!!");
            callback(error, null)
        } else {
            if (response.statusCode != 200) {
                callback({'statusCode':statusCode}, null)
            } else {
                analyzeOpenIeFromNlpAnnotation(body.sentences, callback)
            }
        }
    })
}

function analyzeOpenIeFromNlpAnnotation(nlpAnnotation, callback) {
    let returnVal = []
    let sentencesCount = nlpAnnotation.length;
    for (let i= 0; i < sentencesCount; i ++) {
        let currentSentence = {}
        let currentResult = nlpAnnotation[i]
        currentSentence.openie = []
        for (let j = 0; j < currentResult .openie.length; j ++) {
            let triplet = currentResult .openie[j]
            let returnTriplet = {}
            returnTriplet.subject = triplet.subject
            returnTriplet.relation = triplet.relation
            returnTriplet.object = triplet.object

            returnTriplet.subjectSpan = triplet.subjectSpan
            returnTriplet.relationSpan = triplet.relationSpan
            returnTriplet.objectSpan = triplet.objectSpan
            returnTriplet.full = returnTriplet.subject + " " + returnTriplet.relation + " " + returnTriplet.object
            currentSentence.openie.push(returnTriplet)
        }
        returnVal.push(currentSentence)
    }
    callback(null, returnVal)
}

p = "In the Senate race, one of the most unexpectedly tight in the nation, any small shift among evangelical voters - long a stable base for Republicans - could be a significant loss for Mr. Cruz, who, like President Trump, has made white evangelicals the bulwark of his support. To Democrats nationwide, who have largely written off white evangelical voters, it also sends a signal - not just for the midterms but also for the 2020 presidential campaign - that there are female, religious voters who are open to some of their party's candidates. One in three Texans are evangelical, according to the Pew Research Center, and 85 percent of white evangelical voters in Texas supported Mr. Trump in 2016, higher than even the national average, which was a record high for a presidential election. The New York Times's Upshot section has been polling the race, and most public opinion polls show Mr. Cruz holding a small lead.Still, Ms. Mooney and her friends may represent an under-the-radar web of white, evangelical women in Texas whose vote in November may be more up for grabs than at any time in the recent past. The church in Texas is becoming a testing ground for the future of the evangelical voice in politics, and for evangelicals who oppose the new religious right's momentum. In Texas, since the 2016 election, black worshipers have been leaving white churches, and some white evangelical women have tiptoed away from Mr. Trump. Spending money to win over evangelical voters is not as much of a priority as trying to turn out people who voted for Ms. Clinton, says Jason Stanford, a former longtime Democrat strategist in Texas."

analyzeOpenIeFromParagraph(p, (err, annotatedResult) => {
    console.log("\n\nStuffs\n\n")
    utils.logFullObject(annotatedResult)
})