let express = require('express');
let bodyParser = require('body-parser');

let router = express.Router()
let app = express()

app.use(bodyParser.urlencoded({extended: false}))

//My custom scripts
const annotator = require('./../NLPHandler/nlpAnnotator');
const webReader = require('./../NewsGatherer/legacy/webContentReader')
const similarityModule = require('./../NLPHandler/legacy/similarityModule')

const sentimentComparer = require('./Unpolarizer/sentimentComparer')
const coreFeatureExtractor = require('./NLPHandler/coreFeatureExtractor')
const articlesComparer = require('./Unpolarizer/articlesComparer')


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

router.post('/extractCoreFeature', function(req, res, next) {
    console.log('Post - Get core feature function!!!')
    console.log(req.body)
    coreFeatureExtractor.extractCoreFeaturesAndEntitiesAndMetaFromUrl(req.body.data, function(error, response) {
        if (error) {
            error.note = 'There is an ERROR, please check if you have started the Stanford CORE NLP server!';
            res.json(error)
        } else {
            res.json(response)
        }
    })
});

router.post('/sentimentTopSimilar', function(req, res, next) {
    console.log('Post - Get core feature function!!!')
    console.log(req.body)
    sentimentComparer.getTopUnpolarizeArticle(req.body.data, function(error, response) {
        if (error) {
            error.note = 'There is an ERROR, please check if you have started the Stanford CORE NLP server!';
            res.json(error)
        } else {
            res.json(response)
        }
    })
});


router.post('/sentimentTopRelevant', function(req, res, next) {
    console.log('Post - Get core feature function!!!')
    console.log(req.body)
    sentimentComparer.getTopRelevantArticle(req.body.data, function(error, response) {
        if (error) {
            error.note = 'There is an ERROR, please check if you have started the Stanford CORE NLP server!';
            res.json(error)
        } else {
            res.json(response)
        }
    })
});

router.post('/oieTopRelevant', function(req, res, next) {
    console.log('Post - Get core feature function!!!')
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



module.exports = router;
