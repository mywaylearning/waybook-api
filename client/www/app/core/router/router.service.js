'use strict';

function RouterService($state, $stateParams, $location, DEFAULT_PER_PAGE) {
  var service;

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
    return $state.go('app.dashboard');
  }

  function _goToLoggedOut() {
    var stateTo = 'app.login';

    if (stateTo === $state.current.name) {
      return $state.transitionTo(
        $state.current,
        $stateParams,
        {reload: true, inherit: false, notify: true}
      );
    }

    return $state.go(stateTo, null, {reload: true});
  }

  function _goTo(stateName, params, noreload) {
    var _params = params;

    if (params === 'actuals') {
      _params = $stateParams;
    }

    return $state.transitionTo(
      stateName,
      _params,
      {reload: !noreload, inherit: false, notify: true}
    );
  }

}

module.exports = ['$state', '$stateParams', '$location', 'DEFAULT_PER_PAGE', RouterService];
