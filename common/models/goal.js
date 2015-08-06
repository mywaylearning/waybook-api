'use strict';

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

module.exports = function(Goal) {

  Goal.createNewGoal = function(goal, request, callback) {
    goal.userId = request.user.id;
    goal.postType = 'g';

    var Tag = Goal.app.models.Tag;

    if (Object.prototype.toString.call(goal.tags) === '[object Array]') {
      saveTags(goal.tags, Tag);
    }

    if (goal.files && goal.files.length) {
      validateFiles(goal);
    }

    return Goal.create(goal, callback);
  };

  Goal.listGoals = function(request, cb) {
    var currentUser = request.user;

    var filter = {
      where: {
        userId: currentUser.id
      },
      include: ['WaybookUser']
    };
    Goal.find(filter, cb);
  };

  /**
   * Find post with provided id and filtered by current user.
   * Allow delete only if current user is the owner of the object
   */
  Goal.deletePost = function(postId, request, callback) {
    var currentUser = request.user;

    var filter = {
      userId: currentUser.id
    };

    return Goal.findById(postId, filter, function(error, goal) {

      if (error) {
        return callback(error);
      }

      if (!goal) {
        return callback({
          error: 'object not found or you are not authorized to delete it'
        });
      }

      return Goal.destroyById(postId, callback);
    });
  }
};
