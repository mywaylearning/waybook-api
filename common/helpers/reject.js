/**
 * Helper function to return callback with error
 */
var reject = function(message, callback) {
    return callback({
        error: message
    });
};

module.exports = reject;