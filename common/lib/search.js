/**
 * Search posts and contacts by tag, owner and type
 */

'use strict';

var includes = require('lodash.includes');
var async = require('async');
var filter = require('../helpers/filterArrayString');
var fromArray = require('../helpers/fromArray');

/**
 * Search Contacts or Posts by tag associated to current user
 */
module.exports = function(tag, ownerId, type, request, callback) {
    var Post = this.app.models.Post;
    var Contact = this.app.models.Contact;
    var Share = this.app.models.Share;
    var parallel = {};
    var currentUser = request.user;

    var query = {
        where: {
            userId: request.user.id
        }
    };

    var postQuery = {
        where: {
            userId: request.user.id
        }
    };

    var shared = function(after) {
        Share.find({
            where: {
                sharedWith: currentUser.id
            },
            include: [{
                relation: 'Post',
                scope: {
                    include: [{
                        relation: 'WaybookUser'
                    }]
                }
            }]
        }, function(error, posts) {

            if (error) {
                return after(error, null);
            }

            var filtered = posts.map(function(item) {
                return item.toJSON().Post;
            });

            if (ownerId) {
                filtered = filtered.filter(function(item) {
                    return item.userId === +ownerId;
                });
            }

            if (!tag) {
                return after(null, filtered);
            }

            filtered = filter(posts, 'tags', tag);
            var store = fromArray(filtered, 'id');

            var systemTags = filter(posts, 'systemTags', tag);

            systemTags.map(function(item) {
                store[item.id] = item;
            });

            var data = Object.keys(store).map(function(id) {
                return store[id];
            });

            return after(null, data);
        });
    };

    var contacts = function(after) {

        Contact.find(query, function(error, contacts) {
            if (error) {
                return after(error, null);
            }

            var filtered = contacts.filter(function(item) {
                var tags = (item.tags || []).map(function(item) {
                    return item.text;
                });
                return includes(tags, tag);
            });

            return after(null, filtered);
        });
    };

    /**
     * GET all posts then filter by tag
     */
    var posts = function(after) {

        if (type) {
            postQuery.where.postType = type;
        }

        Post.find(postQuery, function(error, posts) {

            if (error) {
                return after(error, null);
            }

            if (!tag) {
                return after(null, posts);
            }

            var filtered = filter(posts, 'tags', tag);
            var store = fromArray(filtered, 'id');
            var systemTags = filter(posts, 'systemTags', tag);

            systemTags.map(function(item) {
                store[item.id] = item;
            });

            var data = Object.keys(store).map(function(id) {
                return store[id];
            });

            return after(null, data);
        });
    };

    parallel.shared = shared;
    parallel.contacts = contacts;
    parallel.posts = posts;

    return async.parallel(parallel, function(error, data) {
        if (error) {
            return callback(error);
        }

        var response = {};
        response.contacts = data.contacts;
        response.posts = data.posts || [];
        response.owners = [];

        var owners = {};

        data.shared && data.shared.map(function(item) {

            if (item.WaybookUser) {
                owners[item.WaybookUser.id] = item.WaybookUser;
            }
            response.posts.push(item);
        });

        Object.keys(owners).map(function(id) {
            response.owners.push(owners[id]);
        });

        return callback(null, response);
    });
};
