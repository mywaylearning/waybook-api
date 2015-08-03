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

module.exports = function(Goal) {

  Goal.createNewGoal = function(goal, request, callback) {
    goal.userId = request.user.id;
    goal.postType = 'g';

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
