/*
    Since I'm not using this LIB, I will remove it, but I will leave this code here
    as a reminder that
    1. I tried this
    2. Maybe use it later when the project is different.
    If I decide to use this again, the working install in package.json would be
    "node-summary": "1.1.0",
*/
/**
 * Created by Le Pham Minh Duc on 04-Apr-18.
 */
/*
    There is a small problem with this package is that it use the command "import" for its lib
    and somehow, NodeJS doesn't support that thing yet, so to fix it,
    you either change the compiler to babel JS or some very complicated thing like that
    or roll back and just use an older version (1.1.0, which I'm using now)
    compare to the latest version: 1.2.0
*/
//OLD TOOLS, probably not use anymore
// const summaryTool = require('node-summary');
//
// let title = 'Paragraph breaks using Stanford CoreNLP'
// let content = " Image copyright . EPA/ Yulia Skripal/Facebook . Image caption . Sergei Skripal, 66, and his daughter Yulia, 33, were poisoned by a nerve agent called Novichok . The precise source of the nerve agent used to poison a Russian ex-spy and his daughter has not been verified, says the head of Porton Down laboratory. The defence research facility, which identified the substance in Salisbury as Novichok, said it was likely to have been deployed by a \"state actor\". The UK said further intelligence led to its belief that Russia was responsible. Russia's president has said he hopes a line can be drawn when the chemical weapons watchdog meets on Wednesday. Expressing surprise at the \"pace\" of what he described as an \"anti-Russia campaign\", Vladimir Putin added that Russia wants to be part of the investigation and hopes \"a line can be drawn under\" the incident. Porton Down's chief executive Gary Aitkenhead dismissed Russian claims it might have come from the UK military laboratory. \"We have not identified the precise source, but we have provided the scientific info to [the] government who have then used a number of other sources to piece together the conclusions,\" Mr Aitkenhead said. \"It is our job to provide the scientific evidence of what this particular nerve agent is - we identified that it is from this particular family and that it is a military grade, but it is not our job to say where it was manufactured.\" . A UK government spokesperson said that identifying the substance at Porton Down was \"only one part of the intelligence picture\". It maintained Russia was responsible, adding there was \"no other plausible explanation\". Sergei Skripal and his daughter Yulia were attacked with the nerve agent on 4 March. The BBC understands Miss Skripal, 33, is now conscious and talking. Salisbury District Hospital has said her father, 66, remained critically ill but stable. Mr Aitkenhead said he had been advising those treating the Skripals. \"Unfortunately this is an extremely toxic substance. There is not, as far as we know, any antidote that you can use to negate the effects of it,\" he added. Analysis . By Frank Gardner, BBC security correspondent . The man who runs the government's Defence Science and Technology Laboratory at Porton Down chose his words carefully today. Speaking strictly as a scientist, Gary Aitkenhead said that his staff had not yet verified that the nerve agent used to poison the Skripals had come from Russia. It was not his scientists' role, he said, to work out the source of the poison, implying that the government had reached the conclusion that Russia was to blame from other sources - notably secret intelligence. His comments come a day before an extraordinary meeting - called by Russia - with the world's chemical weapons watchdog, the executive council of the Organisation for the Prohibition of Chemical Weapons (OPCW). 'The whole truth' . \"We hope to discuss the whole matter and call on Britain to provide every possible element of evidence they might have in their hands,\" said the Russian ambassador to Ireland, Yury Filatov. \"Russia is interested in establishing the whole truth of the matter and we hope certainly that this meeting will help to return to at least the realm of normality within the realm of international law and...decency in international relations.\" . A Foreign Office spokesman called the meeting a \"diversionary tactic, intended to undermine the work of the OPCW in reaching a conclusion\". \"There is no requirement in the chemical weapons convention for the victim of a chemical weapons attack to engage in a joint investigation with the likely perpetrator,\" he added. Image copyright . Getty Images . Image caption . The Skripals were found on a bench in Salisbury . So far 29 nations have expelled diplomats over the poisoning, which the British government holds Russia responsible for. Russia has now told the UK that . more than 50 of its diplomats have to leave . the country. In a news conference on Monday, Russian Foreign Minister Sergei Lavrov suggested the poisoning could be \"in the interests of the British government\" because of the \"uncomfortable situation\" they had found themselves in with Brexit. \"There could be a whole number of reasons and none of them can be ruled out,\" . Mr Lavrov said . "
//
// summaryTool.summarize(title, content, function(err, summary) {
//     if(err) {
//         console.log("Something went wrong man!");
//     } else {
//         console.log(summary);
//
//         console.log("Original Length " + (title.length + content.length));
//         console.log("Summary Length " + summary.length);
//         console.log("Summary Ratio: " + (100 - (100 * (summary.length / (title.length + content.length)))));
//     }
// });

