'use strict';
var tape = require('tape');
var asq = require('../../lib/asq');

tape('ASQ algorithm', function(test) {
    test.plan(1);

    var callback = function(score) {
        test.equal(score, 2, 'asq should return computed percentage result');
    };

    var agree = [
        2, 4, 5, 6, 7, 9, 12, 13, 16, 18, 19, 20, 21, 22, 23, 26, 33, 35, 39, 41,
        42, 43, 45, 46
    ];

    var disagree = [
        1, 3, 8, 10, 11, 14, 15, 17, 24, 25, 27, 28, 29, 30, 31, 32, 34, 36, 37,
        38, 40, 44, 47, 48, 49, 50
    ];

    var responses = {
        1: '3'
    };

    asq(agree, disagree, responses, callback);
});
