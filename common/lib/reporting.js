/**
 * Return all necesary data to build 10 years plan report
 */
'use strict';

const async = require('async');
const reject = require('../helpers/reject');
const classifyPosts = require('../helpers/classifyPosts');

function mapShared(models) {
    let result = [];
    models.map(model => {
        let object = model.toJSON();

        if (!object.Post || !object.WaybookUser) {
            return;
        }

        /**
         * As per requirements, only resource posts should be included.
         * This can be achieved by using proper query, but current version
         * of loopback doesn't allow double `where` query. One on share and
         * one on Post model association.
         */
        if (object.Post.postType !== 'resource') {
            return;
        }

        object.Post.WaybookUser = object.WaybookUser;
        result.push(object.Post);
    });
    return result;
}

module.exports = (request, User, callback) => {
    let currentUser = request.user;
    let Post = User.app.models.Post;
    let Contact = User.app.models.Contact;
    let Share = User.app.models.Share;
    let parallel = {};

    let postsQuery = {
        where: {
            userId: currentUser.id
        }
    };

    let contactsQuery = {
        where: {
            userId: currentUser.id
        }
    };

    let sharedQuery = {
        where: {
            sharedWith: currentUser.id
        },
        include: [{
            relation: 'WaybookUser',
            scope: {
                fields: ['id', 'email', 'firstName', 'lastName', 'username']
            }
        }, {
            relation: 'Post'
        }]
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

    parallel.shared = (after) => {
        return Share.find(sharedQuery, after);
    };

    let asyncCallback = (error, data) => {
        if (error) {
            console.log('error on load posts', error);
            return reject('error on load posts', callback);
        }

        let result = classifyPosts(data.posts);
        result.contacts = data.contacts || {};
        result.shared = mapShared(data.shared || []);
        return callback(null, result);
    };

    return async.parallel(parallel, asyncCallback);
};
