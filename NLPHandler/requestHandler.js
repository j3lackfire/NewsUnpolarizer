/**
 * Created by Le Pham Minh Duc on 31-Mar-18.
 */
const request = require('request');

console.log('Test request module!');

let localUrl = 'http://localhost:9000/?properties=%7B%22annotators%22:%22tokenize,ssplit,pos%22,%22outputFormat%22:%22json%22%7D'
let myContent = 'U.S. Defense Secretary Jim Mattis met President Trumps incoming national security adviser, John Bolton, at the Pentagon Thursday and jokingly told him, Ive heard that you are absolutely the devil incarnate and I wanted to meet you. Rough Cut (no reporter narration).'
request.post(
    localUrl,
    { json: myContent },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
        }
    }
);
