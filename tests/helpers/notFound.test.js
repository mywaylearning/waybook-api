'use strict';
var tape = require('tape');
var notFound = require('../../common/helpers/notFound');

tape('propert not found response', function(test) {
    test.plan(3);

    function callback(error) {
        test.equal(!!error, true, 'should return an object');
        test.equal(error.statusCode, 404, 'should return proper status code');
        test.equal(error.message, 'Resource not found', 'proper message');
    }

    notFound(callback);
});
