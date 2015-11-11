'use strict';
var tape = require('tape');
var admin = require('../../common/helpers/isAdmin');

tape('identify admin users', function(test) {
    test.plan(4);

    test.equal(admin(), false, 'should return false for non user object');
    test.equal(admin({}), false, 'should return false for user withour role');

    var user = {
        role: 'admin'
    };

    test.equal(admin(user), true, 'should return true for admin users');

    var badUser = {
        role: 'ADMIN'
    };
    test.equal(admin(badUser), false, 'should return false for bad role');
});
