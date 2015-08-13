'use strict';

var debug = require('debug')('waybook');
var reject = require('../helpers/reject');

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
    goal.postType = goal.postType || 'goal';

    var Tag = Goal.app.models.Tag;

    if (Object.prototype.toString.call(goal.tags) === '[object Array]') {
      saveTags(goal.tags, Tag);
    }

    if (goal.files && goal.files.length) {
      validateFiles(goal);
    }

    return Goal.create(goal, callback);
  };

  /**
   * GET /goals
   */
  Goal.listGoals = function(request, callback) {
    var currentUser = request.user;

    if (!currentUser || !currentUser.id) {
      return reject('not authorized', callback);
    }

    var filter = {
      where: {
        userId: currentUser.id
      },
      include: ['WaybookUser', 'Comment']
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
