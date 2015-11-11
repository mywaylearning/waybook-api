/**
 * Return array of users with defined keys
 */

'use strict';
var pick = require('lodash.pick');

/**
 * Return an array of objects with only properties specified
 * Parameters:
 *     array: data to be used
 *     properties: array of fields: ['id', 'name']
 */
module.exports = function(array, properties) {
    return array.map(function(item) {
        return pick(item, properties);
    });
};
