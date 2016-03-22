'use strict';

var reject = require('../helpers/reject');
const shouldNotifyComment = require('../lib/shouldNotifyComment');
const notifyComment = require('../lib/notifyComment');

module.exports = function(Comment) {

    var load = function(id, callback, after) {

        Comment.findById(id, function(error, comment) {

            if (error) {
                return callback(error);
            }

            if (!comment) {
                return reject('not found or not authorized', callback);
            }

            return after(comment);
        });
    };

    Comment.createComment = function(comment, request, callback) {
        var currentUser = request.user;
        if (!currentUser || !currentUser.id) {
            return reject('authentication required', callback);
        }

        comment.userId = currentUser.id;
        return Comment.create(comment, callback);
    };

    /**
     * Find comment with provided id.
     * Allow delete only if current user is the owner of the object
     */
    Comment.deleteComment = function(commentId, request, callback) {
        var currentUser = request.user;

        var after = function(comment) {
            if (comment.userId !== currentUser.id) {
                return reject('Not authorized', callback);
            }

            return Comment.destroyById(commentId, callback);
        };

        load(commentId, callback, after);
    };

    /**
     * PUT /comments/ID
     */
    Comment.put = function(id, data, request, callback) {
        if (!id || !data) {
            return reject('params required', callback);
        }

        if (!request.user || !request.user.id) {
            return reject('user requiered', callback);
        }

        data.id = id;

        var after = function(comment) {
            if (comment.userId !== request.user.id) {
                return reject('Not authorized', callback);
            }

            console.log(comment.comment, data.comment);

            if (!data.comment) {
                return reject('comment required', callback);
            }

            return Comment.upsert(data, callback);
        };

        return load(id, callback, after);
    };

    /**
     * Hooks
     */
    Comment.observe('after save', function(context, next) {

        var model = {
            modelName: context.Model.modelName,
            modelId: context.instance.id,
            object: context.instance,
            userId: context.instance.userId
        };

        var action = context.isNewInstance ? 'CREATE' : 'UPDATE';

        Comment.app.models.Event.createEvent(model, action);

        shouldNotifyComment(context, Comment.app.models.Post)
            .then(data => {
                return notifyComment(data);
            })
            .then(sent => console.log(sent))
            .catch(error => console.log('error on notify comment', error));

        next();
    });
};
