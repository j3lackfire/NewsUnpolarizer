/**
 * Created by Le Pham Minh Duc on 15-Oct-18.
 */
const relevanceProcessor = require('./Unpolarizer/relevanceProcessor')
const articlesComparer = require('./Unpolarizer/articlesComparer')
const dbReader = require('./LocalDB/dbReader')
const utils = require('./utils')

// dbReader.readDbAsJson((err, res) => {
//     for (let i = 0; i < res.length; i ++) {
//         articlesComparer.findMostRelevanceByUrl(res[i].meta.url, (err, result) => {
//             if (utils.isNullOrUndefined(result)) {
//                 let metaObject = {}
//                 metaObject = res[i].meta
//                 metaObject.relatedSentencesCount = 0
//                 metaObject.oppositeSentencesCount = 0
//                 utils.logFullObject(metaObject)
//             } else {
//                 utils.logFullObject(result[0].meta)
//             }
//         })
//     }
// })

let url = "http://www.atimes.com/article/why-the-west-wont-act-on-chinas-uighur-crisis/"
articlesComparer.findMostRelevanceByUrl(url, (err, res) => {
    // for (let i = 0; i < res.length; i ++) {
    //     utils.logFullObject(res[i].meta)
    // }
    // console.log(res.length)
    utils.logFullObject(res)
})

