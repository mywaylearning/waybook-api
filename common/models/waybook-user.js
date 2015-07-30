'use strict';

module.exports = function(WaybookUser) {

  WaybookUser.getAuthenticatedUser = function(request, callback) {
    var currentUser = request.user;
    var filter = {
      fields: {
        username: false
      }
    };

    WaybookUser.findById(currentUser.id, filter, callback);
  };

  /**
   * POST /users
   */
  WaybookUser.createUser = function(user, request, callback) {
    return WaybookUser.create(user, callback);
  }
};
