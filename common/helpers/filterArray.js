/**
 * Filter array and return items where key property equals value
 *
 * Usage:
 *     var filter = require('./filter');
 *     [].filter(filter(myKey, myValue));
 */
'use strict';

module.exports = function filter(key, value) {
    return function(item) {
        return item[key] === value;
    };
};
