(function() {

  'use strict';

  var debug = require('debug')('waybook:DashboardController');

  function DashboardController($scope, $stateParams) {
    debug('here we are');
  }

  module.exports = ['$scope', '$stateParams', DashboardController];

}());
