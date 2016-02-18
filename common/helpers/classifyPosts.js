/**
 * Return an object with post types keys and array of types as values
 */

'use strict';

const types = {
    goal: 'goals',
    discovery: 'discoveries',
    resource: 'resources'
};

module.exports = posts => {

    let response = {
        goals: [],
        discoveries: [],
        habits: [],
        resources: []
    };

    (posts || []).map(post => {
        if (post.gRecurringEnabled) {
            return response.habits.push(post);
        }

        types[post.postType] && response[types[post.postType]].push(post);
    });

    return response;
};
