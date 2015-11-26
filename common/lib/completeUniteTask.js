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
    career: 'career'
};

module.exports = function(TaskRecords, contactInstance, request) {

    /**
     * TODO: Validate if tag is present on array of tags
     */
    var tag = contactInstance.tags ? tagList[contactInstance.tags[0].text] : '';

    if (!tag) {
        return;
    }

    var query = {
        where: {
            title: 'unite ' + tag
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
