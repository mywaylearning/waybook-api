'use strict';

/**
 * Check mark contactInstance task as completed
 */

/**
 * Tags based on /guideme/guideme.toml tags
 * There will be a task to add this as an admin section
 */
var tagList = {
    education: 'education',
    career: 'career',
    finance: 'finance',
    health: 'health'
};

module.exports = function(TaskRecords, contactInstance, request) {
    /**
     * TODO: Validate if tag is present on array of tags
     */
    var tag = contactInstance.tags ? contactInstance.tags[0] : '';

    if (!tag) {
        return;
    }

    var option = tagList[tag.text.replace('#', '')];

    if (!option) {
        return;
    }

    var query = {
        where: {
            title: 'unite ' + option
        }
    };

    var model = {
        userId: request.user.id,
        title: 'unite ' + tag,
        skip: false,
        completed: true,
        createdAt: new Date()
    };

    TaskRecords.findOrCreate(query, model, function() {});
};
