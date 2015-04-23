(function() {

  'use strict';

  var debug = require('debug')('waybook:AuthStoreService');

  function AuthStoreService(store, LOCAL_STORAGE_KEYS) {
    var svcInterface,
        key = LOCAL_STORAGE_KEYS.auth;

    /**
     * Public
     */
    svcInterface = {
      save: _save,
      destroy: _destroy,
      getAccessToken: _getAccessToken,
      getRefreshToken: _getRefreshToken
    };
    return svcInterface;

    /**
     * Private
     */
    function _save(data) {
      store.set(key, data);
    }

    function _getAccessToken() {
      debug('in _getAccessToken, key %s', key);
      if (isStoreEmpty()) {
        return undefined;
      }

      return store.get(key).access_token;
    }

    function _getRefreshToken() {
      if (isStoreEmpty()) {
        return undefined;
      }

      return store.get(key).refresh_token;
    }

    function _destroy() {
      store.remove(key);
    }

    function isStoreEmpty() {
      return angular.isUndefined(store.get(key));
    }
  }

  module.exports = ['store', 'LOCAL_STORAGE_KEYS', AuthStoreService];

}());
