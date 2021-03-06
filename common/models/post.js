'use strict';

var debug = require('debug')('waybook');

var reject = require('../helpers/reject');
var prepareShare = require('../helpers/prepareShare');
var sortByDate = require('../helpers/sortByDate');
var getMonths = require('../helpers/getMonths');
var timelineObjects = require('../helpers/timelineObjects');
var rangeBetweenDates = require('../helpers/rangeBetweenDates');
var search = require('../lib/search');
var completeGoalTask = require('../lib/completeGoalTask');
var notAuthorized = require('../helpers/notAuthorized');

var email = require('../../lib/email');
var async = require('async');
var moment = require('moment');
require('moment-range');
var addEvent = require('../lib/addEvent');

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

var MONTH_FORMAT = process.env.WAYBOOK_MONTH_FORMAT;
var GOAL = 'goal';

module.exports = function(Post) {

    Post.search = search;

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

    Post.createPost = function(post, request, callback) {
        var currentUser = request.user;
        post.userId = request.user.id;
        post.postType = post.postType || GOAL;

        /**
         * By default goal posts will contain status set to Active
         */
        if (post.postType === GOAL) {
            post.gStartDate = post.gStartDate || new Date();
            post.gStatus = 'Active';
        }

        var Share = Post.app.models.Share;
        var Tag = Post.app.models.Tag;
        var Contact = Post.app.models.Contact;

        if (Object.prototype.toString.call(post.tags) === '[object Array]') {

            post.tags = post.tags.map(function(item) {
                return item.toLowerCase();
            });

            saveTags(post.tags, Tag);
        }

        if (post.files && post.files.length) {
            validateFiles(post);
        }

        var sharePost = function(data) {
            var emailData = prepareShare(data, currentUser);
            emailData.templateId = templateId;
            emailData.text = textTemplate;
            emailData.html = htmlTemplate;
            emailData.subject = '-learnerFirstName- -learnerLastName- has shared a -postType- with you on the Waybook';

            email(emailData, function(error, sent) {
                console.log(error || sent);
            });

            if (post.sharedfrom) {
                return Post.findOne({
                    id: post.sharedFrom
                }, (error, found) => {
                    if (error) {
                        return callback(error);
                    }
                    if (!found.canShare) {
                        return notAuthorized(callback);
                    }
                });
            }

            return Share.withMany(data);
        };

        return Post.create(post, function(error, data) {
            if (error) {
                return callback(error);
            }

            if (data.postType === GOAL) {
                var TaskRecords = Post.app.models.TaskRecords;
                completeGoalTask(TaskRecords, data, request);
            }

            /**
             * Only share if there are contacts to share with
             * TODO: Refactor this callback hell, its functional for now..
             */
            if (data.share && data.share.length) {
                var newContacts = data.share.filter(function(item) {
                    if (!item.id) {
                        item.userId = currentUser.id;
                    }
                    return !item.id;
                });

                if (newContacts.length) {

                    Contact.bulkCreate(newContacts, function(error, contacts) {
                        if (error) {
                            console.log(error);
                        } else {

                            data.share = contacts.map(function(result) {
                                return result[0];
                            });

                            sharePost(data);
                        }
                    });
                } else {
                    sharePost(data);
                }
            }

            return callback(null, data);
        });
    };

    function forTimeline(request, callback) {

        var query = {
            where: {
                postType: GOAL,
                userId: request.user.id
            },
            fields: ['id', 'content', 'image', 'tags', 'gEndDate', 'systemTags']
        };

        return Post.find(query, function(error, posts) {
            if (error) {
                return reject('error on query posts', callback);
            }

            var sorted = sortByDate(posts, 'gEndDate');
            var months = getMonths(posts, MONTH_FORMAT);

            /**
             * Start means(for now), 36 months after the last in the future
             * gEndDate associated to a goal.
             */
            var startDate = sorted.length ? sorted[0].gEndDate : new Date();
            var start = moment(startDate).add(36, 'months')._d;

            /**
             * end means, starting from today, 6 months before the very first
             * goal
             */
            var end = moment().subtract(6, 'months')._d;

            var data = {
                start: start,
                end: end,
                months: months,
                format: MONTH_FORMAT
            };

            var range = rangeBetweenDates(data);
            var concated = sorted.concat(range);
            var timeline = timelineObjects(sortByDate(concated, 'gEndDate'), MONTH_FORMAT);

            return callback(null, [timeline, Object.keys(timeline)]);
        });
    }

    function byTag(tag, request, callback) {

        var query = {
            where: {
                postType: GOAL,
                userId: request.user.id
            },
            fields: ['id', 'content', 'tags', 'gEndDate', 'systemTags']
        };

        return Post.find(query, function(error, posts) {
            if (error) {
                return reject('error on query posts', callback);
            }

            /**
             * Done in this way since Mysql is not allowed to query in array,
             * right now.
             */
            posts = posts.filter(function(post) {
                return post.tags.indexOf(tag) !== -1;
            });

            if (!posts || !posts.length) {
                return callback(null, [{},
                    []
                ]);
            }

            var timeline = {};
            var sorted = sortByDate(posts, 'gEndDate');
            var months = getMonths(posts, MONTH_FORMAT);

            var startDate = sorted.length ? sorted[0].gEndDate : new Date();
            var start = moment(startDate).add(36, 'months')._d;

            /**
             * end means, starting from today, 6 months before the very first
             * goal
             */
            var end = moment().subtract(6, 'months')._d;

            var data = {
                start: start,
                end: end,
                months: months,
                format: MONTH_FORMAT
            };

            var range = rangeBetweenDates(data);
            var concated = sorted.concat(range);
            timeline = timelineObjects(sortByDate(concated, 'gEndDate'), MONTH_FORMAT);

            return callback(null, [timeline, Object.keys(timeline)]);
        });
    }

    function sharedPost(postId, request, callback) {
        let filter = {
            where: {
                postId: +postId
            },
            include: {
                relation: 'WaybookUser',
                scope: {
                    fields: ['id', 'username', 'email', 'firstName', 'lastName']
                }
            }
        };

        return request.app.models.Share.find(filter, (error, data) => {
            if (error) {
                return callback(error, null);
            }

            var result = data.filter(item => !!item.toJSON().WaybookUser);
            return callback(null, result);
        });
    }

    /**
     * GET /posts
     */
    Post.indexPost = function(postType, tag, timeline, request, callback) {
        var currentUser = request.user;

        if (timeline && !tag) {
            return forTimeline(request, callback);
        }

        if (tag) {
            return byTag(tag, request, callback);
        }

        var Share = Post.app.models.Share;

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

        if (postType) {
            filter.where.postType = postType;
            return Post.find(filter, callback);
        }

        return async.parallel({

                /**
                 * Return posts shared with current user
                 */
                shared: function(after) {
                    let query = {
                        where: {
                            sharedWith: currentUser.id
                        },
                        include: [{
                            relation: 'Post',
                            scope: {
                                include: [{
                                    relation: 'WaybookUser',
                                    scope: {
                                        fields: fields
                                    }
                                }, {
                                    relation: 'Comment',
                                    scope: {
                                        include: 'WaybookUser',
                                        scope: {
                                            fields: fields
                                        }
                                    }
                                }]
                            }
                        }]
                    };

                    return Share.find(query, after);
                },

                /**
                 * Return My own posts
                 */
                own: function(after) {
                    return Post.find(filter, after);
                },

                /**
                 * Get all post ID's muted from current user
                 */
                muted: function(after) {
                    let posts = {};

                    return Post.app.models.MutedPosts
                        .byUserId(currentUser.id)
                        .then(data => {
                            /**
                             * Return an object {postId: postId}
                             */
                            data.map(item => posts[item.postId] = item.postId);
                            return after(null, posts);
                        })
                        .catch(error => after(error));
                }
            },

            function(error, data) {
                if (error) {
                    console.log('error on load posts', error);
                    return reject('error on load posts', callback);
                }

                var posts = {};
                var originalPosts = [];

                data.own.map(function(post) {

                    if (post && post.sharedFrom) {
                        originalPosts.push(post.sharedFrom);
                        posts[post.sharedFrom] = post;
                    }
                });

                data.shared.map(function(post) {
                    var model = post.toJSON();

                    /**
                     * If a post has shared with someone it means it will not
                     * have 'sharedFrom' since it's not re-shared, so, to fill
                     * this field, we assign sharedFrom to a post id
                     */
                    if (model.Post && !model.Post.sharedFrom) {
                        model.Post.sharedFrom = post.postId;
                    }

                    if (model.Post && model.Post.id /*&& model.Post.sharedFrom */ ) {
                        originalPosts.push(model.Post.sharedFrom);
                        posts[model.Post.sharedFrom] = model.Post;
                        data.own.push(model.Post);
                    }
                });

                return Post.find({
                    where: {
                        id: {
                            inq: originalPosts
                        }
                    },
                    include: {
                        relation: 'WaybookUser',
                        scope: {
                            fields: ['id', 'email', 'firstName', 'lastName', 'username']
                        }
                    }
                }, function(error, originals) {

                    if (error) {
                        return reject('error on loading shared posts', callback);
                    }

                    if (originals && originals.length) {
                        originals.map(function(item) {
                            /**
                             * If post owner is the same owner as the original
                             * post, then, shared from should be false
                             */
                            if (posts[item.id].userId == item.userId) {
                                posts[item.id].sharedFrom = false;
                                return;
                            }

                            posts[item.id].originalShared = item;
                        });
                    }


                    /**
                     * Filter for muted posts
                     * Return only non muted posts
                     * TODO: Since pagination has been postponed, we need to
                     * keep an eye on performance doing a lot of filters and map
                     */
                    let filtered = data.own.filter(item => !data.muted[item.id + '']);

                    return callback(null, filtered);
                });
            });
    };

    /**
     * GET /posts/POST_ID
     * shared: if true, means we need to retrieve activity about postId param
     */
    Post.getPost = function(postId, shared, request, callback) {

        var Share = Post.app.models.Share;
        var currentUser = request.user;

        var filter = {
            where: {
                id: +postId,
                userId: +currentUser.id
            },
            include: [{
                relation: 'WaybookUser',
                scope: {
                    fields: ['id', 'firstName', 'lastName', 'email']
                }
            }, {
                relation: 'Comment',
                scope: {
                    include: 'WaybookUser'
                }
            }]
        };

        if (shared) {
            return sharedPost(postId, request, callback);
        }

        return Post.findOne(filter, function(error, data) {
            if (error) {
                return callback(error, null);
            }

            if (!data) {
                /**
                 * Scenario where we dont have a match post. Meaning, post could
                 * have been shared with current user, so, lets query for Share.
                 * If found any, return proper Post object
                 */
                return Share.findOne({
                    where: {
                        postId: +postId,
                        sharedWith: currentUser.id
                    }
                }, function(error, data) {
                    if (error) {
                        return callback(error);
                    }

                    if (!data) {
                        error = new Error();
                        error.statusCode = 401;
                        error.message = 'Not authorized';
                        return callback(error, null);
                    }


                    delete filter.where.userId;
                    return Post.findOne(filter, callback);
                });
            }

            if (!data.sharedFrom) {
                return callback(null, data);
            }

            Share.findOne({
                where: {
                    postId: data.sharedFrom
                },
                include: {
                    relation: 'WaybookUser',
                    scope: {
                        fields: ['id', 'email', 'firstName', 'lastName', 'username']
                    }
                }
            }, function(error, original) {
                if (error) {
                    return callback(error, null);
                }

                if (!original) {
                    return callback(null, data);
                }

                filter.where.userId = undefined;
                filter.where.id = original.postId;

                return Post.findOne(filter, function(error, post) {
                    data.originalShared = post;
                    return callback(error, data);
                });
            });
        });
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

            /**
             * Remove shared record from Share table
             */
            Post.app.models.Share.deleteShared(post.id, post.userId);
            return Post.destroyById(postId, function(error, deleted) {

                var model = {
                    modelName: Post.modelName,
                    modelId: postId,
                    object: post,
                    userId: post.userId,
                    action: 'DELETE'
                };

                Post.app.models.Event.createEvent(model, model.action);
                return callback(error, deleted);
            });
        };

        load(postId, callback, after);
    };

    Post.put = function(id, data, request, callback) {

        if (!id || !data) {
            return reject('params required', callback);
        }

        var currentUser = request.user;

        if (!currentUser || !currentUser.id) {
            return reject('user required', callback);
        }

        /**
         * data.mute holds value to check if we need to `mute` or `unmute` a
         * post
         */
        if (data.mute === true || data.mute === false) {
            return Post.app.models.MutedPosts
                .toggle(currentUser.id, id, data.mute)
                .then(updated => callback(null, updated))
                .catch(error => callback(error));
        }

        var Share = Post.app.models.Share;
        data.id = id;
        data.userId = currentUser.id;
        data.image = data.image || null;
        data.files = data.files || null;

        data.tags = data.tags.map(function(item) {
            return item.toLowerCase();
        });


        if (data.gStatus === 'Abandoned') {
            data.gAbandonedDate = new Date();
        }

        if (data.gStatus === 'Achieved') {
            data.gAchievedDate = new Date();
        }

        var sharePost = function(data) {
            var emailData = prepareShare(data, currentUser);
            emailData.templateId = templateId;
            emailData.text = textTemplate;
            emailData.html = htmlTemplate;
            emailData.subject = '-learnerFirstName- -learnerLastName- has shared a -postType- with you on the Waybook';

            email(emailData, function(error, sent) {
                console.log(error || sent);
            });

            Share.withMany(data);
        };

        var after = function(post) {
            if (post.userId !== currentUser.id) {
                return reject('Not authorized', callback);
            }

            /**
             * Only share if there are contacts to share with
             * TODO: Refactor this callback hell, its functional for now..
             */
            if (data.share && data.share.length) {
                var newContacts = data.share.filter(function(item) {
                    if (!item.id) {
                        item.userId = currentUser.id;
                    }
                    return !item.id;
                });

                if (newContacts.length) {

                    Post.app.models.Contact.bulkCreate(newContacts, function(error, contacts) {
                        if (error) {
                            console.log(error);
                        } else {

                            data.share = contacts.map(function(result) {
                                return result[0];
                            });

                            sharePost(data);
                        }
                    });
                } else {
                    sharePost(data);
                }
            }

            if (post.gStatus !== data.gStatus) {

                var model = {
                    modelName: 'Post',
                    modelId: post.id,
                    object: post,
                    userId: post.userId,
                    action: 'GOAL_STATUS_CHANGED'
                };
                Post.app.models.Event.createEvent(model, model.action);
            }

            return Post.upsert(data, callback);
        };

        return load(id, callback, after);
    };

    /**
     * Hooks
     */

    /**
     * After SAVE or Update
     */
    Post.observe('after save', function(context, next) {
        addEvent(context, Post);
        next();
    });
};
