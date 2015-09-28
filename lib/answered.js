'use strict';

/**
 * From an object of questions answered, return true if all questions have an
 * answer associated, otherwise return false
 */
module.exports = function(responses) {
    return Object.keys(responses).every(function(id) {
        return !!responses[id].answer;
    });
};
