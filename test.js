/**
 * Created by Le Pham Minh Duc on 15-Oct-18.
 */
const coreFeatureExtractor = require('./NLPHandler/coreFeatureExtractor')
const utils = require('./utils')

p = "Melania Trump, maybe America's most private first lady ever, is a woman whose quiet presence on Pennsylvania Avenue is almost the polar opposite of the image projected by her husband. Interested in Melania Trump? Add Melania Trump as an interest to stay up to date on the latest Melania Trump news, video, and analysis from ABC News. \"I love Washington. I love to live there. And I made the White House home - for our son and my husband - and we love to live in the White House,\" Trump told ABC's Chief National Affairs Correspondent Tom Llamas. With a scenic wildlife preserve in Kenya as the backdrop, Llamas asked Melania Trump if traveling was one of the best parts of being first lady.  ong before traveling the world as first lady of the United States, Melania Trump spent her youth in a small central European town before navigating the ranks of the fashion world and eventually landing in the country she now calls home. Six days after her interview with Llamas, the first lady's staff clarified her comments, telling ABC News, \"The president often apologizes to Mrs. Trump for all the media nonsense and scrutiny she has been under since entering the White House.\" After her team initially denied any subtext in the jacket's words, the first lady told Llamas that wearing that jacket was a deliberate choice, meant \"For the people and for the left-wing media who are criticizing me. I want to show them that I don't care. You could criticize whatever you want to say, but it will not stop me to do what I feel is right.\""

coreFeatureExtractor.extractCoreFeatures(p, (err, result) => {
    coreFeatureExtractor.trimShorterTriplets(result, (trimmedResult) => {
        for (let i = 0; i < result.length; i ++) {
            for (let j = 0; j < result[i].triplets.length; j ++) {
                console.log(result[i].triplets[j].full)
            }
        }
        utils.logFullObject(result)
    })
})

