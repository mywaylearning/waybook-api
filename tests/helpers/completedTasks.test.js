'use strict';
var tape = require('tape');
var completed = require('../../common/helpers/completedTasks');

tape('from Array helper', function(test) {
    test.plan(6);

    var data = [{
        title: 'foo'
    }, {
        title: 'bar',
        disabled: true
    }];

    var store = {
        bar: {
            completed: true,
            skip: true
        }
    };

    var result = completed(data, store);

    test.equal(result[0].title, 'foo', 'should return proper title');
    test.equal(result[0].skip, false, 'should return false for skip property');
    test.equal(result[0].completed, false, 'should not be completed');
    test.equal(result[1].skip, true, 'should return true with proper store');
    test.equal(result[1].completed, true, 'should be completed');
    test.equal(result[1].disabled, true, 'should be disabled');
});
