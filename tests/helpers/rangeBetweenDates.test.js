'use strict';
var tape = require('tape');
var range = require('../../common/helpers/rangeBetweenDates');

tape('get Array of dates between range', function(test) {
    test.plan(1);

    var start = new Date(1452451224940);
    var end = new Date(1447178844510);

    var data = {
        start: start,
        end: end,
        months: {},
        format: 'MMMM YYYY'
    };

    var result = range(data);
    test.equal(result.length, 3, 'should return proper dates range');
});
