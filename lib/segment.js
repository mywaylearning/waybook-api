'use strict';

var Analytics = require('analytics-node');
var analytics = new Analytics(process.env.WAYBOOK_SEGMENT);

module.exports = analytics;
