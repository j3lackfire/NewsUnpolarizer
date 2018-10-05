/**
 * Created by Le Pham Minh Duc on 31-Mar-18.
 */
//This module will generate URL so that the NLP module can understand
/*
The main goal is to convert from this, which is an invalid url

    properties={"annotators":"tokenize,ssplit,pos","outputFormat":"json"}

to this, which is a valid URL:

    properties=%7B%22annotators%22:%22tokenize,ssplit,pos%22,%22outputFormat%22:%22json%22%7D

*/
let baseURL = 'http://localhost:9000/?'
let defaultSettings = 'properties={"annotators":"sentiment,ner","outputFormat":"json"}'
// let defaultSettings = 'properties={"annotators":"tokenize,ssplit,ner,openie","outputFormat":"json"}'

//Default function, I think it will requires name
function getDefaultURL() {
    return baseURL + encodeURIComponent(defaultSettings);
}

module.exports.getDefaultURL = getDefaultURL;