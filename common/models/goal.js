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

var tags = function(content) {
  var unique = {};

  content
    .split('<span class="hashtag">#')
    .filter(function(text) {

      var tag = text.split('</span');

      if (tag.length && tag[1]) {
        unique[tag[0]] = tag[0];
      }
    });

  return unique;
};

module.exports = function(Goal) {

  Goal.createNewGoal = function(goal, request, callback) {
    goal.userId = request.user.id;
    goal.postType = 'g';
    var Tag = Goal.app.models.Tag;

    goal.tags = Object.keys(tags(goal.content));

    /**
     * Based on tags added to the model, find or create each tag
     */
    goal.tags.map(function(text) {
      Tag.createTag(text, function(error /*, created*/ ) {
        if (error) {
          return debug('way:create:tag', error);
        }
      });
    });

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
};
