'use strict';

var file = require('fs');
var toml = require('toml-j0.4');

module.exports = function(path, callback) {
    file.readFile(path, 'utf8', function(error, content) {
        if (error) {
            return callback(error);
        }
        return callback(null, toml.parse(content));
    });
};
