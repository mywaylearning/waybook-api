'use strict';
var reject = require('./reject');

module.exports = function(id, callback, after) {

    this.findById(id, function(error, data) {

        if (error) {
            return callback(error);
        }

        if (!data) {
            return reject('not found or not authorized', callback);
        }

        if (!after) {
            return callback(null, data);
        }

        return after(data);
    });
};
