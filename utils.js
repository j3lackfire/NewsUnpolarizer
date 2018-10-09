/**
 * Created by Le Pham Minh Duc on 09-Oct-18.
 */

function isNullOrUndefined(val) {
    return (typeof(val) == "undefined" || val == null || val == "")
}

module.exports.isNullOrUndefined = isNullOrUndefined