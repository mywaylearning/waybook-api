/**
 * Return all necesary data to build 10 years plan report
 */
'use strict';
const async = require('async');
const reject = require('../helpers/reject');

const types = {
    goal: 'goals',
    discovery: 'discoveries',
    resource: 'resources',
    thought: 'thoughts'
};

function clasifyPosts(posts) {
    let response = {
        goals: [],
        discoveries: [],
        habits: [],
        thoughts: [],
        resources: []
    };

    (posts || []).map(post => {
        if (post.gRecurringEnabled) {
            return response.habits.push(post);
        }
        response[types[post.postType]].push(post);
    });

    return response;
}

module.exports = (request, User, callback) => {
    let currentUser = request.user;
    let Post = User.app.models.Post;
    let parallel = {};

    let postsQuery = {
        userId: currentUser.id
    };

    /**
     * Return posts where userId === currentUser.id
     */
    parallel.posts = function(after) {
        return Post.find(postsQuery, after);
    };

    let asyncCallback = (error, data) => {
        if (error) {
            console.log('error on load posts', error);
            return reject('error on load posts', callback);
        }

        return callback(null, clasifyPosts(data.posts));
    };

    return async.parallel(parallel, asyncCallback);
};
