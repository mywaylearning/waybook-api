'use strict';

/**
 * How many answers are associated to each question?
 */
var NUMBER_OPTIONS = 5;

function percentage(score, max, min) {
    var result = ((score - min) / (max - min)) * 100;
    return Math.round(result);
}

function getScore(facet, responses) {
    var score = 0;

    facet.matrix.map(function(key) {
        var value = +responses[key.question];
        if (!value) {
            return;
        }

        if (key.reverse) {
            value = 6 - value;
        }
        score += value;
    });
    return score;
}

module.exports = function(matrix, responses, callback) {
    var response = {};

    Object.keys(matrix).map(function(key) {
        var min = matrix[key].matrix.length;
        var max = min * NUMBER_OPTIONS;

        var perc = percentage(getScore(matrix[key], responses), max, min);
        var score = getScore(matrix[key], responses);
        var result;

        if (score < 20) {
            result = matrix[key].levels.low;
        } else if (score < 75) {
            result = matrix[key].levels.mid;
        } else {
            result = matrix[key].levels.high;
        }

        response[key] = {
            description: matrix[key].description,
            score: score,
            result: result,
            percentage: perc,
            max: max,
            min: min
        };
    });

    return callback(response);
};
