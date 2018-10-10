/**
 * Created by Le Pham Minh Duc on 09-Oct-18.
 */
const util = require('util')

function isNullOrUndefined(val) {
    return (typeof(val) == "undefined" || val == null || val == "")
}

function logFullObject(obj) {
    console.log(util.inspect(obj, false, null, true))
}

module.exports.isNullOrUndefined = isNullOrUndefined
module.exports.logFullObject = logFullObject