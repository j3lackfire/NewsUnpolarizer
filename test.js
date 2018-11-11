/**
 * Created by Le Pham Minh Duc on 15-Oct-18.
 */
const coreFeatureExtractor = require('./NLPHandler/coreFeatureExtractor')
const openieProcessor = require('./NLPHandler/openieProcessor')
const tripletProcessor = require('./NLPHandler/tripletMeaningfulProcessor')
const summarizer = require('./NewsGatherer/summarizer')
const utils = require('./utils')

let url = "https://immigrationlab.org/project/the-struggle-to-integrate-muslims-in-europe/"
// let paragraph = "Over the past few years, unprecedented numbers of immigrants have left Muslim-majority countries to come to Europe, fleeing the carnage in Syria and the turmoil across North Africa. They join previous waves of muslim immigrants, many of whom who are not integrating well. In a project they documented in Why Muslim Integration Fails in Christian-Heritage Societies, IPL co-director David Laitin, IPL faculty affiliate Claire Adida, and Marie-Anne Valfort trace the roots of this failed integration in France and across Europe more broadly. Two immigrants who are alike in every single way except for their religious identity will integrate very differently within their host societies. By studying a population of Senegalese Christian and Muslim immigrants from the Serer and Joola religiously mixed communities who migrated to France under identical conditions, they found that Muslim immigrants face greater discrimination in the labor market, earn less monthly income, express less attachment to their host country, and exhibit greater attachment to their country of origin than do their Christian counterparts. These patterns do not improve in subsequent generations. The cause of this failure of integration is twofold: Islamophobia on the part of French society and Muslim immigrants' tendency to identify more with their home communities in response. As a result, Europe is creating a class of under-employed immigrants who feel little or no connection with their host societies. The researchers sent similar resumés of three applicants to French firms. All three were French citizens with secondary school degrees and several years of experience in middle-class jobs. By their names, employers could tell that one was Christian Senegalese, one was Muslim Senegalese, and the third was a native French person. One Senegalese applicant, randomly assigned to the Muslim or Christian name, was matched with the native French applicant for each job. Employers were two and a half times more likely to offer the Christian an interview than the Muslim. In experimental games conducted in Paris' nineteenth district where Serers and Joolas interacted with native French subjects, they once again found that the French exhibit a gratuitous distaste for Muslims, more so than they do for Senegalese Christians. When given the opportunity to withhold money from other people in the experiment, native French subjects were more likely to do so with Senegalese Muslims than with Senegalese Christians. In a survey of 511 Muslim and Christian Serers and Joola living in France, the researchers found that on average, Muslim Serer and Joola families earned 400 euros, or about 15 percent of an average French income, less per month than their Christian counterparts. In other words, there was clear anti-Muslim discrimination in the competition for a middle-class job, which had significant implications for Muslims' prospects of attaining a middle-class lifestyle. There is egregious discrimination in the French labor market. This discrimination led the study's Muslim respondents to view French institutions with much greater distrust than their Christian counterparts. The Muslim respondents were more likely to send remittances back to Senegal and to plan to be buried there. How can this vicious circle of discrimination and distrust be broken? Small nudges, such as publicizing discrimination rates, can raise awareness and reduce discrimination. The researchers note, Muslim communities can do more to encourage gender equality and other norms of their host societies, for example, by shaming community members who refuse to take orders from women. On a macro level, firms should scrutinize their own hiring practices. They should also consider hiring consultants who can help them address tensions that arise due to workplace conflicts related to religion. The one thing countries shouldn't do is ban immigration. Such policies are directed at the wrong targets; they are also counter-productive. They do not tackle the discrimination Muslims face when trying to integrate into their host societies, and they may even exacerbate the failure of Muslim integration by encouraging Muslims to withdraw. Alienating Muslims also comes at a cost to public security, the researchers note. After the Paris attacks of November 13, 2015, in which 130 people died, French authorities closed the country's borders and launched a manhunt for the plot's mastermind, Abdelhamid Abaaoud. The informant who tipped off French authorities about his location? A fellow Muslim."
let paragraph = "In a project they documented in Why Muslim Integration Fails in Christian-Heritage Societies, IPL co-director David Laitin, IPL faculty affiliate Claire Adida, and Marie-Anne Valfort trace the roots of this failed integration in France and across Europe more broadly."

// summarizer.urlToParagraph(url, (err, p) => {
//     if (err) {
//         console.error(err)
//     } else {
//         console.log("Result received from smmry service. Sending to annotator")
//         console.log(p)
//         // openieProcessor.extractRawOpenIeFromParagraph(p, (err, result) => {
//         //     tripletMeaningfulProcessor.filterOpenieResult(result)
//         //     // utils.logFullObject(result)
//         // })
//         coreFeatureExtractor.extractCoreFeatures(p, (err, result) => {
//             for (let i = 0; i < result.length; i ++) {
//                 for (let j = 0; j < result[i].triplets.length; j ++) {
//                     console.log(result[i].triplets[j].full)
//                 }
//             }
//             utils.logFullObject(result)
//         })
//     }
// })

coreFeatureExtractor.extractCoreFeatures(paragraph, (err, result) => {
    for (let i = 0; i < result.length; i ++) {
        for (let j = 0; j < result[i].triplets.length; j ++) {
            console.log(result[i].triplets[j].full)
        }
        // utils.logFullObject(result[i])
        // console.log("\n\n")
    }
    utils.logFullObject(result)
})
