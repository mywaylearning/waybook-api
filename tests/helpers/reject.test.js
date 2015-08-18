'use strict';
var tape = require('tape');
var reject = require('../../common/helpers/reject');

tape('reject helper', function(test) {
    test.plan(1);
    var callback = function(object){
        test.equal(object.error, 'my message');
    };

    reject('my message', callback); 
});
