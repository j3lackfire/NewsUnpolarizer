# Un-polarizing news on social media platform
## What is this ?
This project is a part of the master thesis from Minh Duc Le Pham, a student from the University of Jyväskylä, Finland.
The main purpose of this project is to suggest news from different point of view when talked about a topic.

### Why ?
- Nowadays, many people get their main source of news from social media platform
    - In 2016: 38% American get news from online source
    - In 2017: 66% American use Facebook and 45% of them get news from their Facebook page
- People are being polarized by social media site (better citation needed)
    - By the nature of the social media platform as a whole .
    - By the platform algorithm that try to attract you.
- This might lead to a wrong, polarized understanding of the subject.

### Solution - idea
- Let people be aware of the alternative point of view
    - Alternative (Oxford dictionary definition): available as another possibility or choice.
    - In this context: different (positive/negative/neutral) attitude about some certain subjects.
    - Just let people know about the other side, and that is already enough.
    - The system cannot fact-check, it can only provide news as is.
- For example:
    - When you read a news about Trump’s tax evasion, you should be aware of his other contribution to the society as well.
        - http://www.newsweek.com/donald-trumps-first-appearance-panama-papers-uncovered-722266
        - http://money.cnn.com/2017/08/04/news/economy/jobs-trump-vs-obama/index.html
### Solution - front end:
- For the user:
    - A web browser (chrome/firefox/safari/edge ...) extension that when clicked, provide information about the alternative point of view.
    - Smart settings and filters:
        - Subjects
        - Relevant
        - Timestamp
        - Summarization of the other point of view.
    - Metrics, graphs, charts, and analytics to see the overall trend of the subjects.
        - Example: You would see 100 news about Climate change in comparison to 1 climate change denier news.
### Solution - back end:
- A web service that can analyze a news in textual form using NLU:
    - Categories by main subject, minor subject, subject’s association 
    - Rank and group by adjectives, tones, attitudes and sentiments.
- Find and suggest news from the alternative point of views for the user
    - Analyzes the news the user is reading
    - Find the most suitable news from the analyzed pools.
- Short summary of the text so people don't have to read through the whole thing.

## Installation guide:
This is only the back end of the application, there is no front end (yet). This application is built using NodeJS because it's fast and easy for prototyping.

The NodeJS app run on port 9001. To run the app, you need two parts: NodeJS and the Stanford core NLP server.

__ First, for the Node JS part: __
- Install NodeJS - https://nodejs.org/en/
- Clone this project to your machine.
- npm install
- npm start
- check at 

```    http://localhost:9001/helloWorld    ```
    - If you see the text: "Hello world!", congratulation, the NodeJS server is up and running!.

Note: NodeJS required packages:
- express - for setting up the server.
- request - to send request to the NLU server.
- body-parser - to parse the web request from user.
- node-readability - to extract the article information of the website out
    - https://github.com/luin/readability


__ For the Stanford core NLP server, you will need to download the core NLP server yourself: __
- https://stanfordnlp.github.io/CoreNLP/index.html - main page
- You will need to download the CoreNLP and the English and English (KBP) model jar file.
- Extract the Core NLP and put the two model into the core NLP extracted folder.
- Open terminal/cmd and cd to the folder. For example, in Duc's computer, it would be

```    cd C:\Users\Le Pham Minh Duc\Desktop\MasterThesis\Standford Core NLP\stanford-corenlp-full```
- Run the command (requires Java 64 bit, if you have Jav 32 bit install, you will receive an error)

```    java -mx4g -cp "*" edu.stanford.nlp.pipeline.StanfordCoreNLPServer -port 9000 -timeout 60000```

The Stanford Core NLP server is now running on port 9000. You can test it by going to 
    
```http://localhost:9000/```

It's also has a nice browser interface to test. Note that first run might take a while (like 1 minute or more for the service to load all of the annotators and models). Subsequence run are much faster (1/2 seconds) because it has already load everything. The service eats a lot of ram though, right now, it needs 3gb of ram.

The Regex Named Entities Recognition doesn't work. It seems, it freeze on my computer for soo long for just one simple sentence search.

## APIs GUIDE

```
    http://localhost:9001/annotateParagraph
    POST request - x-www-form-urlencoded
    request body:
        key: data / value: text you want to annotate
    Response: An array of sentences with sentiment and information and entities list
    [
        {
            "sentiment": "Negative",
            "sentimentValue": "1",
            "tokensCount": 36,
            "charactersCount": 213,
            "entities": [
                {
                    "text": "Fox News",
                    "ner": "ORGANIZATION"
                },
                {
                    "text": "host",
                    "ner": "TITLE"
                },
                ...
            ]
        }, 
        ... 
    ]
```

```
    http://localhost:9001/getCoreFeature
    POST request - x-www-form-urlencoded
    request body:
        key: data / value: text you want to annotate
    Response: the whole value of paragraph and list of all appeared entities and their local sentiment value
    {
        "sentimentValue": 1.1428571428571428,
        "sentencesCount": 21,
        "charactersCount": 2369
        "individualEntitiesList": [
            {
                "text": "Fox News",
                "ner": "ORGANIZATION",
                "sentimentValue": 1.3333333333333333,
                "timesAppear": 3
            },
            ...
        ],
        "abstractEntitiesList": [
            {
                "text": "host",
                "ner": "TITLE",
                "sentimentValue": 1,
                "timesAppear": 2
            },
            ...
        ]
    }
```

```
    http://localhost:9001/getUrlContent
    POST request - x-www-form-urlencoded
    request body:
        key: data / value: the url you want to get content
        For example:
            'data': 'https://www.huffingtonpost.com/entry/sinclair-news-anchor-hits-back-trump_us_5ac2883be4b04646b6453134'

    Response: The content of the web, without all of the html and suggestion and nonsense
    {
        "title": "News Anchor At Sinclair-Owned Station Hits Back At Trump",
        "content": "An evening news anchor at a Sinclair ...."
    }
```

```
    http://localhost:9001/analyzeUrl
    POST request - x-www-form-urlencoded
    request body:
        key: data / value: the url you want to analyze
        For example:
            'data': 'https://www.huffingtonpost.com/entry/sinclair-news-anchor-hits-back-trump_us_5ac2883be4b04646b6453134'
    Response: An array containts 2 element, the analyzed (get core feature) title, and the analyzed of the article content
    [
        "url": "https://www.bangkokpost.com/news/world/1442427/japan-activates-first-marines-since-wwii",
        "title": "Japan activates first marines since WWII",
        "analyzedTitle": {
            "sentimentValue": 2,
            "sentencesCount": 1,
            "charactersCount": 42,
            "discreteEntitiesList": [...],
            "abstractEntitiesList": [...]
        },
        "analyzedContent": {
            "sentimentValue": 2,
            "sentencesCount": 1,
            "charactersCount": 42,
            "discreteEntitiesList": [...],
            "abstractEntitiesList": [...]
        },
    ]   
        
```

```
    http://localhost:9001/suggestSimilarArticle
    POST request - x-www-form-urlencoded
    request body:
        key: data / value: the url you want to suggest a similar stories
        For example:
            'data': 'https://www.huffingtonpost.com/entry/sinclair-news-anchor-hits-back-trump_us_5ac2883be4b04646b6453134'
    Response: An array containts 2 element, the analyzed (get core feature) title, and the analyzed of the article content
    [
        .
        .
        .
    ]   
        
```

## Interesting stories / problems
For a project this big, there must always be some interesting stories that I would love to share with you guys

### The try/catch every exception that is wayy outside of it scope.
would probably inside the dbReader file. There is a very simple function that says
```
    function readDbAsJson(callback) {
        _readFile(dbName, (err, response) => {
            if (err) {
                callback(err, null)
            } else {
                try {
                    let jSonObject = JSON.parse(response)
                    callback(null, jSonObject)
                }
                catch (e) {
                    console.log('Dead lock in the db reader, it might be the Local DB is wrong, or it has cautch another error from external module')
                    // callback('Can not parse the string data to JSON', null)
                }
            }
        })
    }
```
Quite simple stuffs, it try to read from the local db file, which is a js file (annotatedArticles.json) and then parse it into a json file.
So, when it read something wrong (not json) it will return an error because it's not a json, because of the try/catch. Simple stuffs, right?
Nope, not. Ofcourse, in this case, it works. But when I'm implementing the similarity module, I chain this function to many outer function, because well, since I store it, I will need to access it later, right?
Which, well, cause the later catch function to just catch error happens after it has done it jobs. OK, JSON object received? Yes, go on. Oh, some you did some typo and cause everything wrong again. Oh, well, it's inside the catch now and let's call the callback function again
Which, drive me a little bit crazy, and clearly, this little try/catch function has gone way, way beyond its purpose.


### The wild world of analyzing website content
I have a library to automatically capture the content inside a url link because the content got from an url link contains a lot of html tags, as well as non important information on the website.
The library works OK, for I would say 95% of the time, but first, it left a lot of html tag back, which, I find a way to remove them, but there are some problems, and sometimes, for case like this:
    
    http://www.nonpareilonline.com/news/politics/national_government/grassley-wants-vote-next-week-on-bill-to-prevent-undue/article_f8023e42-3db7-11e8-a278-7f254d8c96ff.html
    
the content I finally received before putting into the annotation was:
    
    #inform-video-player-1 
    .inform-embed { margin-top: 10px; margin-bottom: 20px; } . 
    #inform-video-player-2 .inform-embed { margin-top: 10px; margin-bottom: 20px; } . 
    WASHINGTON — The chairman of the Senate Judiciary Committee wants his panel to vote as soon as next week on a bipartisan bill to prevent the undue firing of special counsels like Robert Mueller,
    .
    .
    .
    .... #inform-video-player-3 .inform-embed { margin-top: 10px; margin-bottom: 20px; } . 

which was, well, passable, but it could be better, and these results can sometimes mess up with the overall annotation of the article and the sentiment checking.
