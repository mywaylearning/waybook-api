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
module.exports = function(tag, ownerId, request, callback) {
    var Post = this.app.models.Post;
    var Contact = this.app.models.Contact;

    var query = {
        where: {
            userId: request.user.id
        }
    };

    /**
     * Include owner in query filter
     */
    if (ownerId) {
        query.where.userId = ownerId;
    }

    return async.parallel({
        contacts: function(after) {

            Contact.find(query, function(error, contacts) {
                if (error) {
                    return callback(error, null);
                }

                var filtered = contacts.filter(function(item) {
                    var tags = (item.tags || []).map(function(item) {
                        return item.text;
                    });
                    return includes(tags, tag);
                });

                return after(null, filtered);
            });
        },

        /**
         * GET all posts then filter by tag
         */
        posts: function(after) {
            Post.find(query, function(error, posts) {
                if (error) {
                    return callback(error, null);
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
        }
    }, callback);
};
