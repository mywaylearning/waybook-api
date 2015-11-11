'use strict';
var tape = require('tape');
var filter = require('../../common/helpers/filterObjectFields');

tape('identify filter users', function(test) {
    test.plan(2);

    var fields = ['id'];

    var data = [{
        id: 1,
        name: 'bob'
    }, {
        id: 2
    }];


    var result = filter(data, fields);
    console.log(result);

    test.equal(result[0].name, undefined, 'Should validate fields');
    test.equal(result[0].id, 1, 'Should return proper fields');
});
