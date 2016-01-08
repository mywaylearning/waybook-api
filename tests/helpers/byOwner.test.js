'use strict';

var tape = require('tape');
var filterArray = require('../../common/helpers/filterArray');

tape('All questions should have an answer', function(test) {
    test.plan(1);

    var data = [{
        userId: 1,
    }, {
        order: 2,
    }];

    var result = data.filter(filterArray('userId', 1));
    test.equal(result.length, 1, 'filtered users');
});
