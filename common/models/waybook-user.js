'use strict';

var debug = require('debug')('waybook:waybook-user');

module.exports = function(WaybookUser) {

  WaybookUser.getAuthenticatedUser = function(req, cb) {
    var currentUser = req.user;
    debug(currentUser);
    WaybookUser.findById(currentUser.id, cb);
  };

  WaybookUser.remoteMethod(
    'getAuthenticatedUser',
    {
      description: 'Returns information about the authenticated user making the request.',
      isStatic: true,
      accepts: [
        {
          arg: 'req',
          type: 'object',
          http: { source: 'req' }
        }
      ],
      returns: [
        {
          description: 'authenticated user information',
          type: 'WaybookUser',
          arg: 'data',
          root: true
        }
      ],
      http: { verb: 'get', path: '/user' }
    }
  );

};
