'use strict';

/**
 * Based on array of objects with format: {gEndDate: <DATE>}, return an object
 * with all months associated to each gEndDate with 'MMMM YYYY' format.
 *
 * @author lesterzone
 */
var moment = require('moment');

/**
 * Return an object where key is a month from each object and with provided
 * format
 * Parameters:
 * data: Array of objects: {gEndDate: <Date>}
 * format: 'MMMM YYYY'
 */
module.exports = function(data, format) {
    var months = {};

    data.map(function(object) {
        var month = moment(object.gEndDate).format(format);
        months[month] = month;
    });
    return months;
};
