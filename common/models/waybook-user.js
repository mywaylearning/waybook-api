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
  };

  WaybookUser.usersIndex = function(input, request, callback) {
    var query = {
      where: {}
    };

    if (input) {
      query.where.username = {
        like: '%' + input + '%'
      };
    }

    return WaybookUser.find(query, function(error, data) {
      if (error) {
        return callback(error);
      }

      /**
       * TODO: Define a schema to respond with(yml file)
       */
      var response = data.map(function(item) {
        return {
          id: item.id,
          email: item.email,
          username: item.username
        }
      });

      return callback(null, response);
    });
  };
};
