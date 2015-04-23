(function() {

  'use strict';

  var debug = require('debug')('waybook:AppController');

  function AppController($scope, app, user) {
    var scope = this;
    // debug(app);
    // debug($scope);
    // debug(scope);
    app.init($scope);
    $scope.$watch(function() { return scope.user; }, onUserUpdate);

    scope.logout = function() {
      app.reset();
      user.logout();
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

  module.exports = ['$scope', 'app', 'user', AppController];

}());
