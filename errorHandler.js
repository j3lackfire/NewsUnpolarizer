/**
 * Created by Le Pham Minh Duc on 06-Oct-18.
 */

function logError(err, callback) {
    console.error("Error happening :" + err)
    callback(null)
}

module.exports.logError = logError