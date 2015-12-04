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
        var title;

        if (task.section === 'goal') {
            title = task.tags[0];
        }

        if (task.section === 'unite') {
            title = 'unite ' + task.tags[0];
        }

        if (task.section === 'explore') {
            title = task.objectId + '';
        }

        var model = store[title || task.title] || {};

        return {
            completed: model.completed || false,
            skip: model.skip || false,
            title: task.title,
            tags: task.tags,
            action: task.action,
            path: task.path,
            section: task.section,
            disabled: task.disabled
        };
    });
};
