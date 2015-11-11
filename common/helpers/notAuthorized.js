/**
 * Return proper not autorized response and status code
 */

'use strict';

/**
 * Using a callback function handler, return proper error message when user is
 * not authorized to use resource requested
 */
module.exports = function(callback) {
    var error = new Error();
    error.statusCode = 422;
    error.message = 'Not authorized';

    return callback(error);
};
