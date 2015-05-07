(function() {

  'use strict';

  var debug = require('debug')('waybook:PlanController');

  function PlanController($scope, $stateParams) {
    debug('here we are');

    $scope.planData = {};

    $scope.doRefresh = function() {
      $scope.$broadcast('scroll.refreshComplete');
    };

  }

  module.exports = ['$scope', '$stateParams', PlanController];

}());
