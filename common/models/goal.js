'use strict';

var debug = require('debug')('waybook');
var reject = require('../helpers/reject');
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
var validateFiles = function(goal) {

    var map = function(item) {
        return {
            url: item.url,
            filename: item.filename,
            mimetype: item.mimetype,
            size: item.size
        };
    };

    goal.files = goal.files.map(map);
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

var share = function(goal, currentUser) {
    var names = [];
    var links = [];
    var emails = [];
    var learnerFirstNames = [];
    var learnerLastNames = [];
    var postType = [];

    var substitutions = {};
    var link = process.env.WAYBOOK_WEB_CLIENT_URL + 'goal/' + goal.id;

    goal.share.map(function(item) {
        /**
         * List of names, emails from each contact to share this post with
         */
        names.push(item.firstName || '');
        emails.push(item.email);

        /**
         * Learner information
         */
        learnerFirstNames.push(currentUser.firstName);
        learnerLastNames.push(currentUser.lastName);
        postType.push(goal.postType);
        links.push(link);
    });

    substitutions['-firstName-'] = names;
    substitutions['-learnerFirstName-'] = learnerFirstNames;
    substitutions['-learnerLastName-'] = learnerLastNames;
    substitutions['-postType-'] = postType;
    substitutions['-link-'] = links;

    var data = {
        to: emails,
        subject: ' ',
        templateId: templateId,
        substitutions: substitutions,
        text: textTemplate,
        html: htmlTemplate
    };

    return email(data, function(err, sent) {
        console.log('error?', err, 'email sent?', sent);
    });
};

module.exports = function(Goal) {

    Goal.createNewGoal = function(goal, request, callback) {
        var currentUser = request.user;
        goal.userId = request.user.id;
        goal.postType = goal.postType || 'goal';

        var Tag = Goal.app.models.Tag;

        if (Object.prototype.toString.call(goal.tags) === '[object Array]') {
            saveTags(goal.tags, Tag);
        }

        if (goal.files && goal.files.length) {
            validateFiles(goal);
        }

        return Goal.create(goal, function(error, data) {
            if (error) {
                return callback(error);
            }

            share(data, currentUser);
            return callback(null, data);
        });
    };

    /**
     * GET /goals
     */
    Goal.listGoals = function(request, callback) {
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
                include: 'WaybookUser',
                //fields: fields
            }
        }];

        var filter = {
            where: {
                userId: currentUser.id
            },
            include: include
        };
        return Goal.find(filter, callback);
    };

    /**
     * Find post with provided id and filtered by current user.
     * Allow delete only if current user is the owner of the object
     */
    Goal.deletePost = function(postId, request, callback) {
        var currentUser = request.user;

        var after = function(goal) {
            if (goal.userId !== currentUser.id) {
                return callback({
                    error: 'Not authorized'
                });
            }
            return Goal.destroyById(postId, callback);
        };

        load(postId, callback, after);
    };

    Goal.put = function(id, data, request, callback) {
        if (!id || !data) {
            return reject('params required', callback);
        }

        if (!request.user || !request.user.id) {
            return reject('user requiered', callback);
        }

        data.id = id;
        data.userId = request.user.id;

        var after = function(goal) {
            if (goal.userId !== request.user.id) {
                return reject('Not authorized', callback);
            }
            return Goal.upsert(data, callback);
        };

        return load(id, callback, after);
    };

    var load = function(id, callback, after) {

        Goal.findById(id, function(error, goal) {

            if (error) {
                return callback(error);
            }

            if (!goal) {
                return reject('not found or not authorized', callback);
            }

            return after(goal);
        });
    };
};
