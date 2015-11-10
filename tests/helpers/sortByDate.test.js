'use strict';
var tape = require('tape');
var sort = require('../../common/helpers/sortByDate');

tape('get sorted array with provided field name', function(test) {
    test.plan(1);

    var FIELD = 'gEndDate';

    var data = [{
        gEndDate: new Date()
    }, {
        gEndDate: new Date(1447178844510)
    }];

    var result = sort(data, FIELD);

    var first = new Date(result[0].gEndDate).getTime();
    var second = new Date(result[1].gEndDate).getTime();

    test.equal(first > second, true, 'should return sorted array');
});
