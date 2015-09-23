'use strict';
var tape = require('tape');
var fromArray = require('../../common/helpers/fromArray');

tape('from Array helper', function(test) {
    test.plan(1);
    var data = [{
        id: 'foobar',
        foo: 'bar'
    }];

    var result = fromArray(data, 'id');

    test.equal(result.foobar.foo, 'bar', 'should return proper object from array');
});
