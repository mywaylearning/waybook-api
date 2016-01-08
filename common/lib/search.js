/**
 * Search posts and contacts by tag, owner and type
 */

'use strict';

var includes = require('lodash.includes');
var async = require('async');
var filter = require('../helpers/filterArrayString');
var fromArray = require('../helpers/fromArray');
var filterArray = require('../helpers/filterArray');

function searchContacts(after, userId, tag, Model) {
    var query = {
        where: {
            userId: userId,
        }
    };

    return Model.app.models.Contact.find(query, function(error, contacts) {
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
}

function searchShared(currentUser, model, after) {

    var query = {
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
    };

    model.app.models.Share.find(query, function(error, posts) {

        return after(error, posts.map(function(item) {
            /**
             * Return actual post, not Share object
             */
            return item.toJSON().Post || {};
        }));
    });
}

function searchPosts(currentUser, type, Model, after) {
    var postQuery = {
        where: {
            userId: currentUser.id
        }
    };

    if (type) {
        postQuery.where.postType = type;
    }

    Model.app.models.Post.find(postQuery, after);
}

function mergeTags(byTags, bySystemTags) {
    var store = fromArray(byTags, 'id');

    bySystemTags.map(function(item) {
        store[item.id] = item;
    });

    return Object.keys(store).map(function(id) {
        return store[id];
    });
}

function filtered(posts, tag, ownerId, type) {

    if (tag) {
        posts = mergeTags(filter(posts, 'tags', tag), filter(posts, 'systemTags', tag));
    }

    if (ownerId) {
        posts = posts.filter(filterArray('userId' ,+ownerId));
    }

    if (type) {
        posts = posts.filter(filterArray('postType', type));
    }

    return posts;
}


/**
 * Search Contacts or Posts by tag associated to current user
 */
module.exports = function(tag, ownerId, type, request, callback) {

    var Post = this.app.models.Post;
    var parallel = {};
    var currentUser = request.user;

    parallel.shared = function(after) {
        return searchShared(currentUser, Post, after);
    };

    /**
     * If there is a tag but no ownerId is provided, we can search for contacts
     */
    if (tag && !ownerId && !type) {
        parallel.contacts = function(after) {
            return searchContacts(after, currentUser.id, tag, Post);
        };
    }

    if (!ownerId || +ownerId === currentUser.id) {
        parallel.posts = function(after) {
            return searchPosts(currentUser, type, Post, after);
        };
    }

    return async.parallel(parallel, function(error, data) {
        if (error) {
            return callback(error);
        }


        var response = {
            contacts: data.contacts,
            posts: filtered(data.posts || [], tag, ownerId, type),
            owners: []
        };

        var owners = {};

        filtered(data.shared || [], tag, ownerId, type)
            .map(function(item) {
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
