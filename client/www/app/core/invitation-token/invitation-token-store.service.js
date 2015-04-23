(function() {

  'use strict';

  function InvitationTokenStoreService(store, LOCAL_STORAGE_KEYS) {
    var service,
        key = LOCAL_STORAGE_KEYS.invitationToken,
        keyDataInvitation = LOCAL_STORAGE_KEYS.invitationData;

    /**
     * Public
     */
    service = {
      save: _save,
      get: _get,
      destroy: _destroy

    };
    return service;


    /**
     * Private
     */
    function _save(data, getData) {
      var k = key;
      if (getData) {
       k = keyDataInvitation;
      }
      store.set(k, data);
    }

    function _get(getData) {
      if (isStoreEmpty()) {
        return undefined;
      }

      var k = key;

      if (getData) {
        k = keyDataInvitation;
      }

      return store.get(k);
    }

    function _destroy() {
      store.remove(key);
    }

    function isStoreEmpty(getData) {
      var k = key;

      if (getData) {
        k = keyDataInvitation;
      }
      return angular.isUndefined(store.get(k));
    }


    return service;
  }

  module.exports = ['store', 'LOCAL_STORAGE_KEYS', InvitationTokenStoreService];

}());
