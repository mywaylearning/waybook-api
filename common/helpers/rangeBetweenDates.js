/**
 * Get Array with range of months with an specific format, used to fill
 * timeline, use `months` object to filter elements to be added to array
 */

'use strict';
var moment = require('moment');
require('moment-range');

/**
 * Parameters
 * data: An Oject with following fields:
 *     start: date object to start range
 *     end: date object to end range
 *     format: 'MMMM YYYY'
 *     months: Object like: {'November 2015': 'November 2015'}
 */
module.exports = function(data) {
    var range = moment.range(data.end, data.start);
    var result = [];

    range.by('months', function(moment) {
        var month = moment.format(data.format);

        if (!data.months[month]) {
            result.push({
                gEndDate: moment._d
            });
        }
    });

    return result;
};
