(function() {

  'use strict';

  var debug = require('debug')('waybook:RouterService');

  function RouterService($state, $stateParams, $location, DEFAULT_PER_PAGE) {
    var service, foo;

    /**
     * Public
     */
    service = {
      goToLoggedIn: _goToLoggedIn,
      goToLoggedOut: _goToLoggedOut,
      goTo: _goTo,
      clearParam: _clearParam
    };
    return service;

    function _clearParam(param) {
      $location.search(param, null);
    }

    /**
     * Redirect user to logged in state
     * @return {Promise} A promise representing the state of the new transition
     */
    function _goToLoggedIn() {
      debug('routing to app.dashboard');
      foo = $state.go('app.dashboard');
      //return $state.go('app.dashboard');
      debug(foo);
      return foo;
    }

    function _goToLoggedOut() {
      debug('routing to public.login');
      var stateTo = 'public.login';

      if (stateTo === $state.current.name) {
        return $state.transitionTo(
          $state.current,
          $stateParams,
          {reload: true, inherit: false, notify: true}
        );
      }

      return $state.go(stateTo, null, {reload: true});
    }


    function _goTo(stateName, params,  noreload) {
      var paramsters = params;

      if (params === 'actuals') {
        paramsters = $stateParams;
      }
      debug('_goTo', stateName);
      return $state.transitionTo(stateName, paramsters, {reload: !noreload, inherit: false, notify: true});
    }

  }

  module.exports = ['$state', '$stateParams', '$location', 'DEFAULT_PER_PAGE', RouterService];

}());
