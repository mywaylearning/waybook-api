'use strict';
var tape = require('tape');
var loadToml = require('../../lib/loadToml');

tape('Load Toml files', function(test) {
    test.plan(1);

    var callback = function(error, data) {
        test.equal(data.meta.name, 'base', 'proper name from parse base.toml file');
    };

    loadToml('./base.toml', callback);
});
