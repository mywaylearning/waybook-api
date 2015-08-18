'use strict';

var debug = require('debug')('waybook');
var reject = require('../helpers/reject');
var prepareShare = require('../helpers/prepareShare');
var email = require('../../lib/email');

var templateId = process.env.WAYBOOK_SHARE_TEMPLATE_ID;

var textTemplate = 'Hello -username-,\n\n[Learner first name] [Learner last ' +
    'name] has shared [post type] with you on the Waybook.\n\nClick through ' +
    'this link to view the contents:\n\n<%body%>\n\n\n…way! helps youth, and ' +
    'what they become, unleash their true potential.';

var htmlTemplate = '<a href="-link-">link</a>';

/**
 * Extract defined properties from `files` object
 */
var validateFiles = function(post) {

    var map = function(item) {
        return {
            url: item.url,
            filename: item.filename,
            mimetype: item.mimetype,
            size: item.size
        };
    };

    post.files = post.files.map(map);
};

/**
 * Based on tags added to the model, find or create each tag
 */
var saveTags = function(tags, Tag) {
    tags.map(function(text) {
        Tag.createTag(text, function(error /*, created*/ ) {
            if (error) {
                return debug('way:create:tag', error);
            }
        });
    });
};

module.exports = function(Post) {

    Post.createNewGoal = function(post, request, callback) {
        var currentUser = request.user;
        post.userId = request.user.id;
        post.postType = post.postType || 'goal';

        var Tag = Post.app.models.Tag;

        if (Object.prototype.toString.call(post.tags) === '[object Array]') {
            saveTags(post.tags, Tag);
        }

        if (post.files && post.files.length) {
            validateFiles(post);
        }

        return Post.create(post, function(error, data) {
            if (error) {
                return callback(error);
            }

            var emailData = prepareShare(data, currentUser);
            emailData.templateId = templateId;
            emailData.text = textTemplate;
            emailData.html = htmlTemplate;
            emailData.subject = ' ';

            email(emailData);
            return callback(null, data);
        });
    };

    /**
     * GET /posts
     */
    Post.listGoals = function(request, callback) {
        var currentUser = request.user;

        if (!currentUser || !currentUser.id) {
            return reject('not authorized', callback);
        }

        var fields = ['email', 'firstName', 'lastName', 'id', 'username'];
        var include = [{
            relation: 'WaybookUser',
            scope: {
                fields: fields
            }
        }, {
            relation: 'Comment',
            scope: {
                include: 'WaybookUser'
            }
        }];

        var filter = {
            where: {
                userId: currentUser.id
            },
            include: include
        };
        return Post.find(filter, callback);
    };

    /**
     * GET /posts/POST_ID
     */
    Post.getPost = function(postId, request, callback) {
        return load(postId, callback);
    };


    /**
     * Find post with provided id and filtered by current user.
     * Allow delete only if current user is the owner of the object
     */
    Post.deletePost = function(postId, request, callback) {
        var currentUser = request.user;

        var after = function(post) {
            if (post.userId !== currentUser.id) {
                return callback({
                    error: 'Not authorized'
                });
            }
            return Post.destroyById(postId, callback);
        };

        load(postId, callback, after);
    };

    Post.put = function(id, data, request, callback) {
        if (!id || !data) {
            return reject('params required', callback);
        }

        if (!request.user || !request.user.id) {
            return reject('user requiered', callback);
        }

        data.id = id;
        data.userId = request.user.id;

        var after = function(post) {
            if (post.userId !== request.user.id) {
                return reject('Not authorized', callback);
            }
            return Post.upsert(data, callback);
        };

        return load(id, callback, after);
    };

    var load = function(id, callback, after) {

        Post.findById(id, function(error, post) {

            if (error) {
                return callback(error);
            }

            if (!post) {
                return reject('not found or not authorized', callback);
            }

            /**
             * Return callback with post if not `after` function is present
             * TODO: Remove usage of `after`
             */
            if (!after) {
                return callback(null, post);
            }
            return after(post);
        });
    };
};
