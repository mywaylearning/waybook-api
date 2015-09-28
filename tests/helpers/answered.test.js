'use strict';
var tape = require('tape');
var answered = require('../../lib/answered');

tape('All questions should have an answer', function(test) {
    test.plan(2);

    var data = [{
        order: '1',
        answer: 'bar'
    }, {
        order: '2',
        answer: 'bar'
    }];

    var badData = [{
        order: '1',
        answer: 'bar'
    }, {
        order: '2',
        answer: ''
    }];

    test.equal(answered(data), true, 'should return true with all answers');
    test.equal(answered(badData), false, 'should return false without an answer');
});
