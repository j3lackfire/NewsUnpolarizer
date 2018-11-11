/**
 * Created by Le Pham Minh Duc on 11-Nov-18.
 */
/*
 We have an edge case of the return value from the Stanford NLP is quite bogus.
 For example, this:
 { subject: 'Fails',
 subjectSpan: [ 10, 11 ],
 relation: 'failed',
 relationSpan: [ 34, 35 ],
 object: 'integration across Europe broadly',
 objectSpan: [ 35, 43 ] }
 The relation span is from 35 to 43, which implies that the relation part is 8 word long,
 However, as we count it, it's only 4 words long, which make 4 words missing.
 The full constructed would be
 +Fails failed integration in France across Europe more broadly+
 It did, recognize this triplet, however, it also recognize like dozens of other weird like the one above.
 Which cause a bug that make the trimmer(the function that will remove the shorter triplets, only leave the longest one)
 does not work
 This function however, might leave some case that may leave out some triplets that will not
 be added to the final result. But, well, we could live with that.
 */

function _isWordCount_and_Span_sameLength(triplet) {
    return (triplet.subjectSpan[1] - triplet.subjectSpan[0] === triplet.subject.split(' ').length
    && triplet.relationSpan[1] - triplet.relationSpan[0] === triplet.relation.split(' ').length
    && triplet.objectSpan[1] - triplet.objectSpan[0] === triplet.object.split(' ').length)
}

function trimShorterTriplets(untrimmedOpenie, callback) {
    console.log("trimShorterTriplets")
    callback(untrimmedOpenie)
    // let returnVal = []
    // for (let i = 0; i < untrimmedOpenie.length; i++) {
    //     let currentVal = {}
    //     currentVal.triplets = []
    //     for (let a = 0; a < untrimmedOpenie[i].triplets.length; a ++) {
    //         if (!_isThereBiggerTriplet(untrimmedOpenie[i].triplets[a], untrimmedOpenie[i].triplets)) {
    //             currentVal.triplets.push(untrimmedOpenie[i].triplets[a])
    //         }
    //     }
    //     returnVal.push(currentVal)
    // }
    // callback(returnVal)
}

function _isThereBiggerTriplet(triplet, tripletList) {
    for (let i = 0; i < tripletList.length; i ++) {
        if (_isTripletWithinTriplet(triplet, tripletList[i])) {
            console.log(triplet.full + " - is part of - " + tripletList[i].full)
            return true
        }
    }
    return false
}

function _isTripletWithinTriplet(smallerTriplet, biggerTriplet) {
    return smallerTriplet != biggerTriplet && //not the same triplet
        _isArrayWithinRange(smallerTriplet.subjectSpan, biggerTriplet.subjectSpan) && //subject
        _isArrayWithinRange(smallerTriplet.relationSpan, biggerTriplet.relationSpan) && //relation
        _isArrayWithinRange(smallerTriplet.objectSpan, biggerTriplet.objectSpan) //object
}

function _isArrayWithinRange(smallerArray, biggerArray) {
    return (smallerArray[0] >= biggerArray[0]) && (smallerArray[1] <= biggerArray[1])
}


module.exports.trimShorterTriplets = trimShorterTriplets