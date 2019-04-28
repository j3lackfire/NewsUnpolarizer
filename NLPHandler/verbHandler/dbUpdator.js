/**
 * Created by Le Pham Minh Duc on 28-Apr-19.
 */
/* This module update the relation VERB field in the article annotation with list of Synonym, antonym and related word*/

const verbProcessor = require('./verbProcessor')
const dbReader = require('./../../LocalDB/dbReader')

//get all verb exist in db, for testing purpose
function _getAllVerbsInDb(callback) {
    let completedNumber = 0
    let listOfVerbList = []
    dbReader.readDbAsJson((err, annotatedArticles) => {
        for (let i = 0; i < annotatedArticles.length; i ++) {
            getAllVerbInArticle(annotatedArticles[i], (verbList) => {
                completedNumber ++
                listOfVerbList.push(verbList)
                if (completedNumber >= annotatedArticles.length) {
                    let verbList = []
                    for (let i = 0; i < listOfVerbList.length; i ++) {
                        for (let j = 0; j < listOfVerbList[i].length; j++) {
                            if (!verbList.includes(listOfVerbList[i][j])) {
                                verbList.push(listOfVerbList[i][j])
                            }
                        }
                    }
                    callback(verbList)
                }
            })
        }
    })
}

function getAllVerbInArticle(articleAnnotation, callback) {
    let verbList = []
    for (let i = 0; i < articleAnnotation.data.length; i ++) {
        let sentenceAnnotation = articleAnnotation.data[i]
        for (let j = 0; j < sentenceAnnotation.triplets.length; j ++) {
            let verb = sentenceAnnotation.triplets[j].relationVerb
            if (!verbList.includes(verb)) {
                verbList.push(verb)
            }
        }
    }
    callback(verbList)
}

function addVerbDataToArticleAnnotation(articleAnnotation, callback) {
    let numberOfVerbRequest = 0
    for (let i = 0; i < articleAnnotation.data.length; i ++) {
        for (let j = 0; j < articleAnnotation.data[i].triplets.length; j++) {
            numberOfVerbRequest ++
        }
    }

    let numberOfVerbProcessed = 0
    for (let i = 0; i < articleAnnotation.data.length; i ++) {
        for (let j = 0; j < articleAnnotation.data[i].triplets.length; j ++) {
            let triples = articleAnnotation.data[i].triplets[j]
            verbProcessor.getVerbResult(triples.relationVerb, (verbResult) => {
                if (verbResult) {
                    triples.verbSynonym = verbResult.syn ? verbResult.syn : []
                    triples.verbAntonym = verbResult.ant ? verbResult.ant : []
                } else {
                    triples.verbSynonym = []
                    triples.verbAntonym = []
                }
                numberOfVerbProcessed ++
                if (numberOfVerbProcessed >= numberOfVerbRequest) {
                    callback(articleAnnotation)
                }
            })
        }
    }
}

function getAllAnnotationsWithVerb(callback) {
    dbReader.readDbAsJson((err, allArticles) => {
        let returnVal = []
        let totalNumber = allArticles.length
        let numberProcessed = 0
        for (let i = 0; i < allArticles.length; i++) {
            addVerbDataToArticleAnnotation(allArticles[i], (annotationResult) => {
                console.log("Finish adding for " + annotationResult.meta.url)
                console.log("Progress " + numberProcessed + " - total: " + totalNumber)
                returnVal.push(annotationResult)
                numberProcessed ++
                if (numberProcessed >= totalNumber) {
                    callback(returnVal)
                }
            })
        }
    })
}

//function to generate a new database with verb information
// getAllAnnotationsWithVerb((newResult) => {
//     const fs = require('fs') //file system to save the file
//     fs.writeFile("newDb.json", JSON.stringify(newResult, null, 2), 'utf8',(err) => {
//         if (err) {
//             console.error("ERROR WRITING the file to the hard drive????")
//         } else {
//             console.log("Finish writing new DB")
//             console.log(newResult.length)
//         }
//     });
// })