/**
 * Based on some user ids, return proper object for each uers
 */

'use strict';

module.exports = function(data, userIds) {
    var result = {};

    userIds.map(function(id) {

        result[id] = {
            supporters: data['supporters-' + id],
            discoveries: data['discoveries-' + id],
            goals: data['goals-' + id],
            questionsCompleted: data['questionsCompleted-' + id],
            questions: data.questions,
        };

        result[id].questionsPending = result[id].questions - result[id].questionsCompleted;
    });

    return result;
};
