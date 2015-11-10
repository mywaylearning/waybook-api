'use strict';
var tape = require('tape');
var months = require('../../common/helpers/getMonths');

tape('get months with specific format from array', function(test) {
    test.plan(1);

    var month = 'November 2015';

    var object = {
        gEndDate: new Date(1447178844510)
    };

    var result = months([object], 'MMMM YYYY');

    test.equal(result[month], month, 'should return proper month format');
});
