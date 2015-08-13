'use strict';

var reject = require('../helpers/reject');

module.exports = function(Comment) {

  Comment.createComment = function(comment, request, callback) {
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
};
