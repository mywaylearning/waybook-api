(function() {

  'use strict';

  var debug = require('debug')('waybook:AppController');

  function AppController($scope, $ionicModal, $timeout, app, user) {
    var scope = this;
    // debug(app);
    // debug($scope);
    // debug(scope);
    app.init($scope);
   // $scope.$watch(function() { return scope.user; }, onUserUpdate);

    scope.logout = function() {
      app.reset();
      user.logout();
    };

    // Create the settings modal
    $scope.settingsData = { volume: 11 };

    $ionicModal.fromTemplateUrl('app/sections/settings/settings.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.closeSettings = function() {
      $scope.modal.hide();
    };

    $scope.showSettings = function() {
      $scope.modal.show();
    };

    $scope.saveSettings = function() {
      $timeout(function() {
        $scope.closeLogin();
      }, 1000);
    };

    // $scope.loginData = {};
    //
    // $ionicModal.fromTemplateUrl('app/sections/app/login.html', {
    //   scope: $scope
    // }).then(function(modal) {
    //   $scope.modal = modal;
    // });
    //
    // $scope.closeLogin = function() {
    //   $scope.modal.hide();
    // };
    //
    // $scope.login = function() {
    //   $scope.modal.show();
    // };
    //
    // $scope.doLogin = function() {
    //   debug('doing login', $scope.loginData);
    //
    //   // simulation -- remove this and put real login logic
    //   $timeout(function() {
    //     $scope.closeLogin();
    //   }, 3000);
    // };
    function onUserUpdate(newVal, oldVal) {

    }
  }

  module.exports = ['$scope', '$ionicModal', '$timeout', 'app', 'user', AppController];

}());
