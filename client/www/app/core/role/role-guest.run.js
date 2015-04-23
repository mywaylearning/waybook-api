(function() {

  'use strict';

  var debug = require('debug')('waybook:Role:guest.run');

  /**
   * A user that is not logged in is considered a guest.
   * A guest is considered to not have a valid access token.
   * @param  {factory} Role
   * @param  {service} auth
   * @param  {constant} ROLES
   * @return {Role}
   */
  function init(Role, auth, ROLES) {

    return new Role(ROLES.guest, validate);

    function validate() {
      debug(auth.isAuthenticated());
      return !auth.isAuthenticated();
    }
  }

  module.exports = ['Role', 'auth', 'ROLES', init];

}());
