(function() {

  'use strict';

  var debug = require('debug')('waybook:DiscoveryController');

  function DiscoveryController($scope, $stateParams) {
    debug('here we are');

    $scope.discoveryData = {};


  }

  module.exports = ['$scope', '$stateParams', DiscoveryController];

}());
