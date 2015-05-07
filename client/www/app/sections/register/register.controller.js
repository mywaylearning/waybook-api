(function() {

  'use strict';

  var debug = require('debug')('waybook:RegisterController');

  function RegisterController($scope, $stateParams) {
    debug('here we are');
  }

  module.exports = ['$scope', '$stateParams', RegisterController];

}());
