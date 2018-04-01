var express = require('express');
var router = express.Router();

//My custom scripts
var paragraphAnnotator = require('./../NLPHandler/paragraphAnnotator');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/helloWorld', function(req, res, next) {
  res.json('Hello world!');
});

let myContent = "Any student should be proud of a 4.2 GPA —incl. @DavidHogg111. On reflection, in the spirit of Holy"

router.post('/annotate', function(req, res, next) {
    console.log('Post - annotate function called !!!')
    // console.log(req.body.json)
    paragraphAnnotator.annotateParagraph(myContent, function(error, response) {
        res.json(response);
    })
});

module.exports = router;
