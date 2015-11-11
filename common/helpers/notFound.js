/**
 * Return proper not found response and status code
 */

'use strict';

/**
 * Using a callback function handler, return proper error message when resource
 * is not found
 */
module.exports = function(callback) {
    var error = new Error();
    error.statusCode = 404;
    error.message = 'Resource not found';

    return callback(error);
};
