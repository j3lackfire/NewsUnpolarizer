let express = require('express');
let bodyParser = require('body-parser');

let router = express.Router()
let app = express()

app.use(bodyParser.urlencoded({extended: false}))

//My custom scripts
const annotator = require('./../NLPHandler/annotator');
const webReader = require('./../NewsGetter/webContentReader')
const similarityModule = require('./../NLPHandler/similarityModule')

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
            error.note = 'There is an ERROR, please check if you have started the server!';
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
            error.note = 'There is an ERROR, please check if you have started the server!';
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
            error.note = 'There is an ERROR, please check if you have started the server!';
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
            error.note = 'There is an ERROR, please check if you have started the server!';
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
            error.note = 'There is an ERROR, please check if you have started the server!';
            res.json(error)
        } else {
            res.json(response)
        }
    })
});

router.post('/suggestSimilarArticle', (req, res, next) => {
    console.log('Suggest Similar Article')
    console.log(req.body)
    similarityModule.findSimilarArticlesToUrl(req.body.data, (error, response) => {
        if (error) {
            error.note = 'There is an ERROR, please check if you have started the server!';
            res.json(error)
        } else {
            response.sourceUrl = req.body.data
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
            error.note = 'There is an ERROR, please check if you have started the server!';
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
            error.note = 'There is an ERROR, please check if you have started the server!';
            res.json(error)
        } else {
            res.json(response)
        }
    })
});


module.exports = router;
