'use strict';

var debug = require('debug')('waybook:models:goal');


module.exports = function(Goal) {

  Goal.createNewGoal = function(newGoal, req, cb) {
    newGoal.userId = req.user.id;
    newGoal.postType = 'g';

    Goal.create(newGoal, function(err, g) {
      if (err) {
        return cb(err);
      }

      return cb(null, g);
    });
    //Goal.findById(currentUser.id, cb);
    // cb(null, null, {'result': 'ok'});
  };


  Goal.listGoals = function(req, cb) {
    var currentUser = req.user;
    var filter = {
      where: {
        userId: currentUser.id
      },
      include: ['WaybookUser']
    };
    Goal.find(filter, cb);
  };

};
