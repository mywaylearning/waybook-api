'use strict';

var tape = require('tape');
var map = require('../../common/helpers/mapDashboardResults');

tape('map dashboard results', function(test) {
    test.plan(10);

    var content = {
        'supporters-1': 1,
        'discoveries-1': 10,
        'goals-1': 11,
        'questionsCompleted-1': 1,
        questions: 10,

        'supporters-2': 2,
        'discoveries-2': 2,
        'goals-2': 2,
        'questionsCompleted-2': 2,
    };

    var userIds = [1, 2];

    var result = map(content, userIds);

    test.equal(result[1].supporters, 1, 'proper supporters');
    test.equal(result[1].discoveries, 10, 'proper discoveries');
    test.equal(result[1].goals, 11, 'proper goals');
    test.equal(result[1].questionsCompleted, 1, 'proper questionsCompleted');
    test.equal(result[1].questions, 10, 'proper questions');

    test.equal(result[2].supporters, 2, 'proper supporters');
    test.equal(result[2].discoveries, 2, 'proper discoveries');
    test.equal(result[2].goals, 2, 'proper goals');
    test.equal(result[2].questionsCompleted, 2, 'proper questionsCompleted');
    test.equal(result[2].questions, 10, 'proper questions');
});
