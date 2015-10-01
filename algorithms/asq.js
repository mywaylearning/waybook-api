'use strict';

/**
 * @see http://archive.wired.com/wired/archive/9.12/aqtest.html
 * How to score: "Definitely agree" or "Slightly agree" responses to questions
 * 2, 4, 5, 6, 7, 9, 12, 13, 16, 18, 19, 20, 21, 22, 23, 26, 33, 35, 39, 41, 42,
 * 43, 45, 46 score 1 point. "Definitely disagree" or "Slightly disagree" responses
 * to questions 1, 3, 8, 10, 11, 14, 15, 17, 24, 25, 27, 28, 29, 30, 31, 32, 34,
 * 36, 37, 38, 40, 44, 47, 48, 49, 50 score 1 point.
 * 1 = "Definitely Agree"
 * 2 = "Slightly Agree"
 * 3 = "Slightly Disagree"
 * 4 = "Definitely Disagree"
 */
module.exports = function(agree, disagree, responses, callback) {
    var score = 0;

    agree.map(function(item) {
        if (responses[item] === '1' || responses[item] === '2') {
            score++;
        }
    });

    disagree.map(function(item) {
        if (responses[item] === '3' || responses[item] === '4') {
            score++;
        }
    });

    return callback(score);
};
