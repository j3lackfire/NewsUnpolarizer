let express = require('express');
let bodyParser = require('body-parser');

let router = express.Router()
let app = express()

app.use(bodyParser.urlencoded({extended: false}))

//My custom scripts
const annotator = require('./../NLPHandler/nlpAnnotator');
const webReader = require('./../NewsGatherer/legacy/webContentReader')
const similarityModule = require('./../NLPHandler/legacy/similarityModule')
const articlesComparer = require('./../Unpolarizer/articlesComparer')
const truthExplorer = require('./../NLPHandler/legacy/old_truthExplorer')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/helloWorld', function(req, res, next) {
    res.json('Hello world!');
});

//Note that the body of the sending data must be x-www-form-urlencoded
router.post('/annotateParagraph', function(req, res, next) {
    console.log('Post - annotate function called !!!')
    console.log(req.body)
    annotator.annotateParagraph(req.body.data, function(error, response) {
        if (error) {
            error.note = 'There is an ERROR, please check if you have started the Stanford CORE NLP server!';
            res.json(error)
        } else {
            res.json(response)
        }
    })
});

router.post('/getCoreFeature', function(req, res, next) {
    console.log('Post - Get core feature function!!!')
    console.log(req.body)
    annotator.getCoreFeature(req.body.data, function(error, response) {
        if (error) {
            error.note = 'There is an ERROR, please check if you have started the Stanford CORE NLP server!';
            res.json(error)
        } else {
            res.json(response)
        }
    })
});

//send an url to the service and the out put is the content of the article.
router.post('/getUrlContent', function(req, res, next) {
    console.log('Get Url content')
    console.log(req.body)
    webReader.extractWebContent(req.body.data, function(error, response) {
        if (error) {
            error.note = 'There is an ERROR, please check if you have started the Stanford CORE NLP server!';
            res.json(error)
        } else {
            res.json(response)
        }
    })
});

//analyze url but NOT add it to the db
router.post('/analyzeUrlNoAdded', function(req, res, next) {
    console.log('Analyze Url No add')
    console.log(req.body)
    annotator.analyzeUrl(req.body.data, function(error, response) {
        if (error) {
            error.note = 'There is an ERROR, please check if you have started the Stanford CORE NLP server!';
            res.json(error)
        } else {
            res.json(response)
        }
    })
});

router.post('/analyzeUrl', function(req, res, next) {
    console.log('Analyze Url')
    console.log(req.body)
    annotator.analyzeUrlAndAddToDb(req.body.data, function(error, response) {
        if (error) {
            error.note = 'There is an ERROR, please check if you have started the Stanford CORE NLP server!';
            res.json(error)
        } else {
            res.json(response)
        }
    })
});

router.post('/suggestSimilarArticles', (req, res, next) => {
    console.log('Suggest Similar Article')
    console.log(req.body)
    similarityModule.findSimilarArticles(req.body.data, (error, response) => {
        if (error) {
            error.note = 'There is an ERROR, please check if you have started the Stanford CORE NLP server!';
            res.json(error)
        } else {
            //this only return the first 3 value, but is that really neccessary???
            // let returnValue = []
            // let numberOfSuggestion = (typeof (req.body.numberOfSuggestion) == 'undefined') ? 3 : parseInt(req.body.numberOfSuggestion)
            // if (numberOfSuggestion >= response.length) {
            //     numberOfSuggestion = response.length - 1
            // }
            // for (let i = 0; i < numberOfSuggestion; i ++) {
            //     returnValue.push(response[i])
            // }
            // res.json(returnValue)
            res.json(response)
        }
    })
});

router.post('/mostSimilarArticle', function(req, res, next) {
    console.log('Most similar article')
    console.log(req.body)
    truthExplorer.getGetMostSimilarArticleWithInsight(req.body.data, function(error, response) {
        if (error) {
            error.note = 'There is an ERROR, please check if you have started the Stanford CORE NLP server!';
            res.json(error)
        } else {
            res.json(response)
        }
    })
});

router.post('/mostRelevantArticleByUrl', (req, res, next) => {
    console.log('Most relevant article by url')
    console.log(req.body)
    articlesComparer.findMostRelevanceByUrl(req.body.data, function(error, response) {
        if (error) {
            error.note = 'There is an ERROR, please check if you have started the Stanford CORE NLP server!';
            res.json(error)
        } else {
            res.json(response)
        }
    })
});

//----------------- TEST --------------------------


router.post('/getUrlContentNoCleanup', function(req, res, next) {
    console.log('getContentWithoutURL')
    console.log(req.body)
    webReader.getContentNoCleanUp(req.body.data, function(error, response) {
        if (error) {
            error.note = 'There is an ERROR, please check if you have started the Stanford CORE NLP server!';
            res.json(error)
        } else {
            res.json(response)
        }
    })
});

router.post('/getContentWithHtml', function(req, res, next) {
    console.log('getContentWithHtml')
    console.log(req.body)
    webReader.getContentWithHtml(req.body.data, function(error, response) {
        if (error) {
            error.note = 'There is an ERROR, please check if you have started the Stanford CORE NLP server!';
            res.json(error)
        } else {
            res.json(response)
        }
    })
});


module.exports = router;
