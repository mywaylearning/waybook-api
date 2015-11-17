/**
 * Return object to be used on display guideme
 */

'use strict';

/**
 * array:  Array of Tasks objects
 * store: {}
 */
module.exports = function(array, store) {
    return array.map(function(task) {
        var model = store[task.title] || {};

        return {
            completed: model.completed || false,
            skip: model.skip || false,
            title: task.title
        };
    });
};
