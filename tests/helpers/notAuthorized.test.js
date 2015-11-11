'use strict';
var tape = require('tape');
var notAuthorized = require('../../common/helpers/notAuthorized');

tape('propert not authorized response', function(test) {
    test.plan(3);

    function callback(error) {
        test.equal(!!error, true, 'should return an object');
        test.equal(error.statusCode, 422, 'should return proper status code');
        test.equal(error.message, 'Not authorized', 'proper message');
    }

    notAuthorized(callback);
});
