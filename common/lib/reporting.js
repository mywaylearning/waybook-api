/**
 * Return all necesary data to build 10 years plan report
 */
'use strict';

const async = require('async');
const reject = require('../helpers/reject');
const classifyPosts = require('../helpers/classifyPosts');

module.exports = (request, User, callback) => {
    let currentUser = request.user;
    let Post = User.app.models.Post;
    let Contact = User.app.models.Contact;
    let parallel = {};

    let postsQuery = {
        userId: currentUser.id
    };

    let contactsQuery = {
        userId: currentUser.id
    };

    /**
     * Return posts where userId === currentUser.id
     */
    parallel.posts = function(after) {
        return Post.find(postsQuery, after);
    };

    /**
     * Return contacts where userId === currentUser.id
     */
    parallel.contacts = function(after) {
        return Contact.find(contactsQuery, after);
    };

    let asyncCallback = (error, data) => {
        if (error) {
            console.log('error on load posts', error);
            return reject('error on load posts', callback);
        }

        let result = classifyPosts(data.posts);
        result.contacts = data.contacts || {};

        return callback(null, result);
    };

    return async.parallel(parallel, asyncCallback);
};
