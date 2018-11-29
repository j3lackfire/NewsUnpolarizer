/**
 * Created by Le Pham Minh Duc on 15-Oct-18.
 */
const articlesComparer = require('./Unpolarizer/articlesComparer')
const coreFeatureExtractor = require('./NLPHandler/coreFeatureExtractor')
const nlpAnnotator = require('./NLPHandler/nlpAnnotator')
const openieProcessor = require('./NLPHandler/openieProcessor')
const summarizer = require('./NewsGatherer/summarizer')
const utils = require('./utils')
const dbWriter = require('./LocalDB/dbWriter')

let url = "http://www.pewforum.org/2011/01/27/the-future-of-the-global-muslim-population/"

let paragraph = "LONDON - What has become of Europe? New laws targeting Muslims are reminiscent of a time when innocent Jewish children were abducted by masked monks and imprisoned in monasteries to \"Save\" them from the eternal fire of hell. In our blind mistrust of religious differences, we are returning to the Middle Ages, when the only model for integration was the forced conversion of the minority religion to the majority. Take Denmark, where the government has introduced new laws mandating that children living in \"Ghetto\" neighborhoods must spend 25 hours apart from their parents every week. During this time, they'll be taught \"Danish values,\" including Christmas and Easter traditions, and receive Danish language classes. By regulating life in these neighborhoods, the government hopes to \"Westernize\" these children and immerse them in Denmark's secular culture and society. They see it as protection of the many at the expense of the few. The harsh penalties for non-compliance suggest intolerance for any form of foreign teaching, religious education and cultural difference. Parents who refuse to cooperate will be fined and their welfare payments halted. The fact that these new rules target low-income, predominantly Muslim enclaves betrays the Danish government's fear that the existence of insular Muslim communities will facilitate the development of extremist ideologies. Denmark is not the only country to target its minority populations and religious freedom in this way. Austria and Belgium have proposed limiting kosher meat slaughter, for example, and several countries - including France and Norway - have banned religious head coverings in schools or among civil servants. Bavaria and Italy have floated legislation that would require crucifixes to be displayed in public buildings. We urgently need to find more effective solutions that do not alienate a group of people based on their religion or country of origin. These types of decisions undermine minority religious communities and have no place in a truly diverse and democratic Europe. Time and time again, history has taught us that civil peace and harmony can't be achieved through repression and forced conversion. Discriminatory policies too quickly descend into totalitarianism - or trigger a damaging backlash. In 15th-century Catholic Spain, the monarchy attempted to \"Solve\" the Jewish question by placing restrictions on Jewish practices, then followed with forced conversion and expulsion. Jewish people were viewed with fear and suspicion as they were not considered Spanish citizens. By the next century, the assimilated Catholic children and grandchildren of the Conversos - those who converted to Roman Catholicism during the 14th and 15th centuries - were much more familiar with the biblical texts than the general Catholic population. They became the standard bearers of the Protestant reformation, which resulted in the destruction of Catholic hegemony over Europe. Czarist Russia also struggled to \"Solve\" the Jewish problem through repression and discrimination. This propelled a disproportionate number of Jewish intellectuals to join the Bolshevik revolution, which almost succeeded in the destruction of Russian Orthodoxy and culture. I feel lucky to live in Europe and consider inclusivity to be its hallmark. Cultural metropolises like London, Milan and Berlin are enriched by the many varied communities that reside within them, by their unique traditions, smells, sights and sounds. Europe is naturally inclusive and peace-loving; our societies are open and free. So what is the right approach? There are certainly times when governments need to act. On Tuesday, Danish prosecutors charged Mundhir Abdallah, a Copenhagen-based imam, with incitement for having preached that the Quran calls on Muslims to \"Fight the Jews and kill them.\" Hate speech of this type is unacceptable in any civilized society. The mosque where Abdallah delivered his sermon was attended by Omar El-Hussein - the 22-year-old gunman behind a double shooting at a free-speech conference and a Copenhagen synagogue - the day before he went on his rampage. Denmark's Jewish community had filed a complaint about Adallah's preachings in May. Violence and hate speech must be combatted, but security concerns cannot be used to justify discrimination against religious minorities. As long as Jews were the sole targets of Islamic terror, Europe's response was silence and indifference. Following the attacks in Paris, Copenhagen, Brussels, Berlin and Nice, when every European is a potential victim, Europe has woken up to the threat of religious hatred. The problem is that the policies European countries have put in place to fight the threat of religious extremism are themselves highly damaging. By enacting discriminatory laws in the guise of \"Protection\" and social cohesion, Europe is slipping into pre-Renaissance religious intolerance. After the devastation of World War II, Europe was rebuilt on principles founded in Judeo-Christian philosophy, such as the dignity of human life, decency, respect and support for the traditional family structure. As governments seek to clamp down on religious differences in the name of security and defense, they are jettisoning these foundations. Islamic extremism is distinct from Islam and this distinction must be made clear at a government level. By enacting discriminatory laws in the guise of \"Protection\" and social cohesion, Europe is slipping into pre-Renaissance religious intolerance, and aligning itself with the authoritarian regimes of the Middle East. Europe must wake up to the poison of racism and religious discrimination that affects us all, regardless of race, religion or citizenship, before it is too late. Rabbi Pinchas Goldschmidt is president of the Conference of European Rabbis."
// let paragraph = "LONDON - What has become of Europe? New laws targeting Muslims are reminiscent of a time when innocent Jewish children were abducted by masked monks and imprisoned in monasteries to \"Save\" them from the eternal fire of hell."

// articlesComparer.findMostRelevancePairInDb((res) => {
//     utils.logFullObject(res)
// })

articlesComparer.findMostRelevanceByUrl(url, (err, res) => {
    console.log("Most relevance article is")
    utils.logFullObject(res)
})

// coreFeatureExtractor.extractCoreFeaturesAndMetaFromUrl(url, (err, res) => {
//     utils.logFullObject(res)
// })

/*
let testPromise = (myParam) => {
    return new Promise((resolve, reject) => {
        console.log("this is the function - " + myParam)
        if (true) {
            resolve("Stuff worked!");
        }
        else {
            reject(Error("It broke"));
        }
    });
}

testPromise("hello world").then((result) => {
    console.log(result); // "Stuff worked!"
}).catch((err) => {
    console.log(err); // Error: "It broke"
});
*/