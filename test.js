/**
 * Created by Le Pham Minh Duc on 15-Oct-18.
 */
const lineReader = require('line-reader');

let refs = []
lineReader.eachLine('ref.txt', function(line, last) {
    refs.push(line)
    // do whatever you want with line...
    if(last){
        refs.sort()
        for (let i = 0; i < refs.length; i ++) {
            console.log(refs[i])
        }
    }
})
