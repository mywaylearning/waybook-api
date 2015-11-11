'use strict';
var tape = require('tape');
var timeline = require('../../common/helpers/timelineObjects');

tape('get timeline from array of objects', function(test) {
    test.plan(1);

    var FORMAT = 'MMMM YYYY';
    var MONTH = 'November 2015';

    var data = [{
        id: 1,
        gEndDate: new Date(1447178844510)
    }, {
        id: 2,
        gEndDate: new Date(1447178844510)
    }];

    var result = timeline(data, FORMAT);
    test.equal(result[MONTH].length, 2, 'Proper objects for timeline');
});
