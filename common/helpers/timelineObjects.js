/**
 * From an array of objects, return proper timeline
 */
'use strict';
var moment = require('moment');

/**
 * Return Array of objects to be used on timeline
 */
module.exports = function(array, format) {
    var timeline = {};

    array.map(function(item) {
        var monthYear = moment(item.gEndDate).format(format);
        timeline[monthYear] = timeline[monthYear] || [];
        if (item.id) {
            timeline[monthYear].push(item);
        }
    });

    return timeline;
};
