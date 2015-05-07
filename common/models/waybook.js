'use strict';
/**
 *
 *    Hang on there, friend.
 *
 *    If you're feeling like you need to edit this file, please don't.
 *    Instead, edit the `scripts/generate-api` script, or the
 *    `scripts/model.tpl` file.
 *
 *    If neither of those include what you want to change, it sounds
 *    like the change you want to make should be made to the spec in
 *    the common/api directory.
 *
 *    Happy hacking!
 *
 */
module.exports = function(Waybook) {

  /**
   * GET /user
   *
   * Returns information about the authenticated user making the request.
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   */
  Waybook.getAuthenticatedUser = function(req, cb) {
    var currentUser = req.user;
    Waybook.app.models.WaybookUser.findById(currentUser.id, cb);
  };



  /**
   * Remote method hook for GET /user
   */
  Waybook.remoteMethod(
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
