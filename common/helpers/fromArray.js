/**
 * Based on array of objects, return a single object with property as key
 * and corresponding value
 */
'use strict';

module.exports = (array, property) =>{
    var response = {};

    array.map(item => response[item[property]] = item);
    return response;
};
