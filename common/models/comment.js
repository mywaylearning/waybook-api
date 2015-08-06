'use strict';

module.exports = function(Comment) {

  Comment.createComment = function(comment, request, callback) {
    return Comment.create(comment, callback);
  };
};
