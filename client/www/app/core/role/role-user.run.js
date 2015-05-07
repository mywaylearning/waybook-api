(function() {

  'use strict';

  var debug = require('debug')('waybook:Role:user.run');

  /**
   * Basic logged in user role. To validate this role there
   * must be a valid access_token and user object.
   * @param  {factory} Role
   * @param  {service} auth
   * @param  {service} user
   * @param  {constant} ROLES
   * @return {Role}
   */
  function init(Role, auth, user, ROLES) {

    return new Role(ROLES.user, validate);

    function validate() {
      debug('in validate');
      return auth.isAuthenticated(true)
                .then(function() {
                  // get curretnly authenticated user
                  return user.getSelf();
                });
    }
  }

  module.exports = ['Role', 'auth', 'user', 'ROLES', init];

}());
