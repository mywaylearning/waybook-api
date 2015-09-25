
'use strict';

/**
 * How many answers are associated to each question?
 */
var NUMBER_OPTIONS = 5;

function percentage(score, max, min) {
    var result = ((score - min) / (max - min)) * 100;
    console.log(score - min, max - min, result);
    return Math.round(result);
}

function getScore(facet, responses) {
    var score = 0;

    facet.matrix.map(function(key){
        var value = responses[key.question];
        if(!value){
            return;
        }

        if(key.reverse){
            value = 6 - +value;
        }
        score += +value;
    });

    console.log('score', score);

    return score;
}

//note: the interface for scoring analyzers takes a callback in case analysis requires I/O from an external resource
module.exports = function(matrix, responses, callback) {
    // module.exports = function(discovery, exploration, cb) {
    var response = {};
    var min = Object.keys(matrix).length;

    /**
     * Max value to be used to compute each facet, is the same as the numbers of
     * facet multiplied by the number of options for each facet
     */
    var max = min * NUMBER_OPTIONS;

    Object.keys(matrix).map(function(key) {
        var score = percentage(getScore(matrix[key], responses), max, min);
        var result;

        if (score < 20) {
            result = matrix[key].levels.low;
        } else if (score < 75) {
            result = matrix[key].levels.mid;
        } else {
            result = matrix[key].levels.mid;
        }

        response[key] = {
            description: matrix[key].description,
            score: score,
            result: result
        };
    });

    return callback(response);
};
