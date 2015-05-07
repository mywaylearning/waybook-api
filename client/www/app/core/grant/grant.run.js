(function() {

  'use strict';
  var debug = require('debug')('waybook:GrantRun');
  function GrantRun($rootScope, $state, user, ERROR) {

    $rootScope.$on('$stateChangeError', onStateChangeError);

    function onStateChangeError(evt, toState, toParams, fromState, fromParams, error) {

      if (error && error.type === ERROR.grantRejected) {
        debug('YOU SHALL NOT PASS!!!', error);

        if (error.stateTo === fromState) {
          evt.preventDefault();
        }

        $state.go(error.stateTo);
      }

      if (error && error.type === ERROR.unauthorizedRequest) {
        user.logout();
      }
    }
  }

  module.exports = ['$rootScope', '$state', 'user', 'ERROR', GrantRun];

}());
