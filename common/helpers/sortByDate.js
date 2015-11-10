'use strict';

/**
 * Sort objects based on date property, should return sorted array
 * @author lesterzone
 *
 * Parameters:
 * array: Array of objects
 * property: Date property to be used on sort
 */
module.exports = function(array, property) {
    return array.sort(function(a, b) {
        return new Date(b[property]).getTime() - new Date(a[property]).getTime();
    });
};