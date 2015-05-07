(function() {

  'use strict';

  var debug = require('debug')('waybook:IntroController');

  function IntroController($scope, $state, $ionicSlideBoxDelegate, store, LOCAL_STORAGE_KEYS) {
    debug('here we are');

    var key = LOCAL_STORAGE_KEYS.introSeen;

    $scope.startApp = function() {
      store.set(key, true);
      $state.go('app.dashboard');
    };

    $scope.next = function() {
      $ionicSlideBoxDelegate.next();
    };

    $scope.previous = function() {
      $ionicSlideBoxDelegate.previous();
    };

    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    };
  }

  module.exports = ['$scope', '$state', '$ionicSlideBoxDelegate', 'store', 'LOCAL_STORAGE_KEYS', IntroController];

}());
