'use strict';
var tape = require('tape');
var big = require('../../algorithms/big5');
var matrix = require('../../algorithms/big5matrix');

tape('Big 5 Personality algorithm', function(test) {
    test.plan(1);

    var callback = function(result) {
        var response = result[Object.keys(result)[0]];
        test.equal(response.score, 24, 'big5 should return proper score field');
    };

    var responses = {
        1: '3',
        2: '3',
        3: '3',
        4: '3',
        5: '3',
        6: '3',
        7: '3',
        8: '3',
        9: '3',
        10: '3',
        11: '3',
        12: '3',
        13: '3',
        14: '3',
        15: '3',
        16: '3',
        17: '3',
        18: '3',
        19: '3',
        20: '3',
        21: '3',
        22: '3',
        23: '3',
        24: '3',
        25: '3',
        26: '3',
        27: '3',
        28: '3',
        29: '3',
        30: '3',
        31: '3',
        32: '3',
        33: '3',
        34: '3',
        35: '3',
        36: '3',
        37: '3',
        38: '3',
        39: '3',
        40: '3',
        41: '3',
        42: '3',
        43: '3',
        44: '3',
        45: '3'
    };

    big(matrix, responses, callback);
});
