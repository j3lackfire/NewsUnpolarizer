let express = require('express');
let bodyParser = require('body-parser');

let router = express.Router()
let app = express()

app.use(bodyParser.urlencoded({extended: false}))

//My custom scripts
const annotator = require('./../NLPHandler/nlpAnnotator');
const webReader = require('./../NewsGatherer/legacy/webContentReader')
const similarityModule = require('./../NLPHandler/legacy/similarityModule')

const sentimentComparer = require('./../Unpolarizer/sentimentComparer')
const articlesComparer = require('./../Unpolarizer/articlesComparer')
const coreFeatureExtractor = require('./../NLPHandler/coreFeatureExtractor')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/helloWorld', function(req, res, next) {
    res.json('Hello world!');
});

router.get('/extractCoreFeatureFromUrl', function(req, res, next) {
    console.log('GET - extractCoreFeatureFromUrl!!!')
    console.log(req.headers.data)
    coreFeatureExtractor.extractCoreFeaturesAndEntitiesAndMetaFromUrl(req.headers.data, function(error, response) {
        if (error) {
            error.note = 'There is an ERROR, please check if you have started the Stanford CORE NLP server!';
            res.json(error)
        } else {
            res.json(response)
        }
    })
});

router.get('/topSimilar', function(req, res, next) {
    console.log('Get - topSimilar!!!')
    console.log(req.headers.data)
    sentimentComparer.getTopUnpolarizeArticle(req.headers.data, function(error, response) {
        if (error) {
            error.note = 'There is an ERROR, please check if you have started the Stanford CORE NLP server!';
            res.json(error)
        } else {
            res.json(response)
        }
    })
});


router.get('/topRelevant', function(req, res, next) {
    console.log('get - topRelevant!!!')
    console.log(req.headers.data)
    sentimentComparer.getTopRelevantArticle(req.headers.data, function(error, response) {
        if (error) {
            error.note = 'There is an ERROR, please check if you have started the Stanford CORE NLP server!';
            res.json(error)
        } else {
            res.json(response)
        }
    })
});

router.get('/topRelevantOIE', function(req, res, next) {
    console.log('Post - Get core feature function!!!')
    console.log(req.headers.data)
    articlesComparer.findMostRelevanceByUrl(req.headers.data, function(error, response) {
        if (error) {
            error.note = 'There is an ERROR, please check if you have started the Stanford CORE NLP server!';
            res.json(error)
        } else {
            res.json(response)
        }
    })
});

module.exports = router;
