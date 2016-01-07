'use strict';
var tape = require('tape');
var event = require('../../common/helpers/eventData');

tape('get Event model data from passed context', function(test) {
    test.plan(5);

    var data = {
        Model: {
            modelName: 'Test'
        },
        isNewInstance: true,
        instance: {
            id: 1,
            userId: 2,
        }
    };

    var result = event(data);

    test.equal(result.userId, 2, 'should return proper userId');
    test.equal(result.action, 'CREATE', 'should return proper action');
    test.equal(result.modelName, 'Test', 'should return proper modelName');
    test.equal(result.modelId, 1, 'should return proper modelId');

    data.action = 'foo';
    test.equal(event(data).action, 'foo', 'proper action whenn provided');
});
