(function() {

  'use strict';

  var debug = require('debug')('waybook:AppService');

  function AppService($rootScope, user, EVENTS) {
    debug($rootScope);
    var service,
        scope;

    /**
     * Public
     */

    service = {
      init: _init,
      setUser: _setUser,
      getUser: _getUser,
      reset: _reset
    };
    return service;


    /**
     * Private
     */
    // function _setCurrentCatalog(catalogObj) {
    //   scope.app.currentCatalog = catalogObj;
    //   $rootScope.$emit(EVENTS.catalogChanged);
    // }

    function _init($scope) {
      debug('AppService:_init');
      debug($scope);
      scope = $scope;
      _reset();
    }

    function _setUser() {
      scope.app.user = user.currentUser().$object;
    }

    function _getUser() {
      return scope.app.user;
    }

    function _reset() {
      debug('AppService:_reset');
      debug(scope.app);
      scope.app.user = {};
    }
  }

  module.exports = ['$rootScope', 'user', 'EVENTS', AppService];

}());
