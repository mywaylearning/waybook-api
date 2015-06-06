(function() {

  'use strict';

  var debug = require('debug')('waybook:FeedController');

  function FeedController($scope, goal) {
    debug('here we are (directive controller)');

    // $scope.planData = {};
    //
    // $scope.doRefresh = function() {
    //   $scope.$broadcast('scroll.refreshComplete');
    // };

    // var ctrl = this;
    // ctrl.feed = goal.collection();
    // debug(ctrl.feed);

    this.feed = {
      items: goal.collection().$object
    };
  }

  module.exports = ['$scope', 'goal', FeedController];

}());
