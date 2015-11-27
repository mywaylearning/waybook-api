'use strict';

var includes = require('lodash.includes');
var async = require('async');
var filter = require('../helpers/filterArrayString');

/**
 * Search Contacts or Posts by tag associated to current user
 */
module.exports = function(tag, request, callback) {
    var Post = this.app.models.Post;
    var Contact = this.app.models.Contact;
    var query = {
        where: {
            userId: request.user.id
        }
    };

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

                return after(null, filtered);
            });
        }
    }, callback);
};
