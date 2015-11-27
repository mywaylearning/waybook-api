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

        if (task.section === 'unite' || task.section === 'goal') {
            title = task.tags[0];
        }
        var model = store[title || task.title] || {};

        console.log("\n", model);
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
