/**
 * Watson interface
 * @see  https://goo.gl/29Qfmu
 */
'use strict';

var watson = require('watson-developer-cloud');

/*jshint camelcase: false */
var personality = watson.personality_insights({
    username: process.env.WAYBOOK_WATSON_USERNAME,
    password: process.env.WAYBOOK_WATSON_PASSWORD,
    version: process.env.WAYBOOK_WATSON_VERSION
});

/**
 * @param { string } text, at least 3500 words text, defined as min from Watson
 * @param { function } callback function(error, profile)
 */
module.exports = function(text, callback) {
    var query = {
        text: text
    };

    personality.profile(query, callback);
};
