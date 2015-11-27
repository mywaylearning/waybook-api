/**
 * Based on array of objects, return objects where an input is present on
 * a specified field
 */
'use strict';
var includes = require('lodash.includes');

module.exports = function(array, field, input) {
    return array.filter(function(item) {
        return includes(item[field] || [], input);
    });
};
