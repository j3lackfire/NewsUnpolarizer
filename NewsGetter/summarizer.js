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
const summaryTool = require('node-summary');

let title = 'Paragraph breaks using Stanford CoreNLP'
let content = "In 1992, two Russian scientists approached The Post's Will Englund, then the Moscow correspondent for the Baltimore Sun, about the country’s secret efforts to create Novichok, the deadly nerve agent that would later allegedly be used to poison double agent Sergei Skripal. (Joyce Lee,Will Englund/The Washington Post) . LONDON — . Scientists at Britain’s top military laboratory said Tuesday that they cannot yet prove that the nerve agent used to poison a former Russian double agent and his daughter in southern England came from Russia. Gary Aitkenhead, chief executive of the Defense Science and Technology Laboratory at Porton Down, told Sky News that researchers were able to identify the substance used in the attack against Sergei and Yulia Skripal as a military-grade nerve agent known as . Novichok , a class of chemical weapons developed by the former Soviet Union and Russia.&nbsp; . But Aitkenhead said the British investigators have not been able to say where the deadly agent was manufactured. “We have not identified the precise source,” he said. Aitkenhead said the nerve agent required “extremely sophisticated methods to create, something probably only in the capabilities of a state actor.” . Russia has denied having anything to do with the attack. Emergency service workers in biohazard suits work last month at the scene where former Russian spy Sergei Skripal and his daughter, Yulia, were found. (Ben Stansall/AFP/Getty Images) . Officials in Moscow have said that Prime Minister Theresa May and British investigators rushed to judgment, or bungled the investigation, or, more insidiously, that Britain or other unknown actors were somehow involved in the attack — that they used a Novichok nerve agent to smear the Russians. The Russian government has posed 41 questions to Britain and international watchdogs, including the following:&nbsp; . ●On the basis of which characteristics (“markers”) has it been ascertained that the substance used in Salisbury “originated from Russia”? . ●Nerve agents act immediately. Why was that not the case with the Skripals? . ●Through what methods did experts identify the substance so quickly? . ●Had they possessed a sample against which to test the substance? If so, where had that sample come from? . Russia’s deputy foreign minister, Alexander Grushko, called the Novichok attack a “provocation arranged by Britain” to support high military spending, while Foreign Minister Sergei Lavrov suggested that it was a false-flag attack to distract citizens from Brexit, Britain’s decision to leave the European Union. On March 27, Russian Foreign Minister Sergei Lavrov called expulsions of Moscow diplomats over a nerve agent attack on British soil “boorish, anti-Russian behavior.” (Reuters) . Russia requested that the Organization for the Prohibition of Chemical Weapons, a global watchdog agency, conduct an “unbiased investigation” into British and U.S.-backed claims that the Russians were behind the attack. The OPCW will convene in The Hague on Wednesday. In a statement, May’s office said: “We have been clear from the very beginning that our world-leading experts at Porton Down identified the substance used in Salisbury as a Novichok, a military-grade nerve agent. “This is only one part of the intelligence picture,” the statement continued. Other elements, it said, include “our knowledge that within the last decade, Russia has investigated ways of delivering nerve agents probably for assassination — and as part of this program has produced and stockpiled small quantities of Novichoks; Russia’s record of conducting state-sponsored assassinations; and our assessment that Russia views former intelligence officers as targets.” . The statement concluded: “It is our assessment that Russia was responsible for this brazen and reckless act and, as the international community agrees, there is no other plausible explanation.” . The former Russian double agent and his daughter, who were found incoherent and comatose, respectively, on a park bench at an outdoor mall in the medieval tourist city of Salisbury a month ago, may have come into contact with the poison at their front door, British authorities said&nbsp; . “Specialists have identified the highest concentration of the nerve agent, to date, as being on the front door of the address,” the Metropolitan Police said. Police did not say how the nerve agent was delivered. The New York Times reported that it was placed on the . doorknob , citing unnamed officials. Yulia Skripal, 33,&nbsp;is now awake and alert, and there is hope that she might be able to offer crucial details in the case. Her father, Sergei, 66, remains in serious but stable condition. In the aftermath of the \u00adattack,&nbsp;26 countries joined Britain in . expelling Russian diplomats . from their embassies. Russia responded with its own . expulsions .&nbsp; . Read more . Today’s coverage from Post correspondents around the world . Like Washington Post World on Facebook and stay updated on foreign news ."

summaryTool.summarize(title, content, function(err, summary) {
    if(err) {
        console.log("Something went wrong man!");
    } else {
        console.log(summary);

        console.log("Original Length " + (title.length + content.length));
        console.log("Summary Length " + summary.length);
        console.log("Summary Ratio: " + (100 - (100 * (summary.length / (title.length + content.length)))));
    }
});
