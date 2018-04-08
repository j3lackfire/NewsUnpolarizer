/**
 * Created by Le Pham Minh Duc on 08-Apr-18.
 */
/*
    To read the file and the annotation
*/
const fs = require('fs') //file system to save the file

let baseFilePath = __dirname + '/DB/'

readFile('myFile.json', (err, data) => {
    if (err) {
    } else {
        console.log(JSON.parse(data))
    }
})

function readFile(fileName, callback) {
    fs.readFile(baseFilePath + fileName, 'utf8', (err, data) => {
        if (err) {
            console.log('Error reading the file ' + fileName)
            callback(err, null)
        } else {
            callback(null, data)
        }
    })
}