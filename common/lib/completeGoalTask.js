'use strict';

/**
 * Check mark goal task as completed
 */

/**
 * Tags based on /guideme/guideme.toml tags
 * There will be a task to add this as an admin section
 */
var tagList = {
    career: 'career',
    family: 'family',
    health: 'healt',
    finance: 'finance',
    social: 'social',
    education: 'education',
};

module.exports = function(TaskRecords, goal, request) {

    /**
     * Only use the first tag for now.
     * TODO: Validate if tag is present on array of tags
     */
    var tag = goal.tags ? tagList[goal.tags[0]] : '';

    if (!tag) {
        return;
    }

    var query = {
        where: {
            title: tag
        }
    };

    var model = {
        userId: request.user.id,
        title: tag,
        skip: false,
        completed: true,
        createdAt: new Date()
    };

    TaskRecords.findOrCreate(query, model, function() {});
};
