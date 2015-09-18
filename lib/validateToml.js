'use strict';

var Validator = require('schema-validator');
var schema = require('./tomlSchema');
var validator = new Validator(schema);

module.exports = function(json){
    return validator.check(json);
};
