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
   * GET /goals
   *
   * Returns a collection of goals for the authenticated user
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Collection|UnexpectedError} result Result object
   * @see Goals.listGoals
   */
  Waybook.listGoals = function(req, cb) {
    Waybook.app.models.Goal.listGoals(req, cb);
  };

  /**
   * Remote method hook for GET /goals
   *
   * @see Goals.listGoals
   */
  Waybook.remoteMethod(
    'listGoals',
    {
      description: 'Returns a collection of goals for the authenticated user',
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
          arg: 'payload',
          root: true,
          type: 'Collection'
        },
      ],
      http: { verb: 'get', path: '/goals' }
    }
  );

  /**
   * PATCH /goals
   *
   * Alter a Goal using JSON-Patch
   * @param {#/definitions/PatchDocument} patch
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {} result Result object
   * @see Goals.patchGoal
   */
  Waybook.patchGoal = function(patch, req, cb) {
    Waybook.app.models.Goal.patch(patch, req, cb);
  };

  /**
   * Remote method hook for PATCH /goals
   *
   * @see Goals.patchGoal
   */
  Waybook.remoteMethod(
    'patchGoal',
    {
      description: 'Alter a Goal using JSON-Patch',
      isStatic: true,
      accepts: [
        {
          arg: 'patch',
          description: 'Patch document describing alterations.',
          required: true,
          type: 'PatchDocument',
          http: { source: 'body' }
        },
        {
          arg: 'req',
          type: 'object',
          http: { source: 'req' }
        }
      ],
      returns: [
      ],
      http: { verb: 'patch', path: '/goals' }
    }
  );

  /**
   * POST /goals
   *
   * Creates a new goal
   * @param {#/definitions/Goal} goal
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Goal} result Result object
   * @see Goals.createNewGoal
   */
  Waybook.createNewGoal = function(goal, req, cb) {
    Waybook.app.models.Goal.createNewGoal(goal, req, cb);
  };

  /**
   * Remote method hook for POST /goals
   *
   * @see Goals.createNewGoal
   */
  Waybook.remoteMethod(
    'createNewGoal',
    {
      description: 'Creates a new goal',
      isStatic: true,
      accepts: [
        {
          arg: 'goal',
          description: 'A Goal object',
          required: true,
          type: 'Goal',
          http: { source: 'body' }
        },
        {
          arg: 'req',
          type: 'object',
          http: { source: 'req' }
        }
      ],
      returns: [
        {
          arg: 'payload',
          root: true,
          type: 'Goal'
        },
      ],
      http: { verb: 'post', path: '/goals' }
    }
  );

  /**
   * GET /user
   *
   * Returns information about the authenticated user
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {User|UnexpectedError} result Result object
   * @see Users.getAuthenticatedUser
   */
  Waybook.getAuthenticatedUser = function(req, cb) {
    Waybook.app.models.WaybookUser.getAuthenticatedUser(req, cb);
  };

  /**
   * Remote method hook for GET /user
   *
   * @see Users.getAuthenticatedUser
   */
  Waybook.remoteMethod(
    'getAuthenticatedUser',
    {
      description: 'Returns information about the authenticated user',
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
          arg: 'payload',
          root: true,
          type: 'User'
        },
      ],
      http: { verb: 'get', path: '/user' }
    }
  );

  /**
   * POST /users
   *
   * Creates a new user via post
   * @param {#/definitions/User} user
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {User|Error} result Result object
   * @see Users.createUser
   */
  Waybook.createUser = function(user, req, cb) {
    Waybook.app.models.WaybookUser.createUser(user, req, cb);
  };

  /**
   * Remote method hook for POST /users
   *
   * @see Users.createUser
   */
  Waybook.remoteMethod(
    'createUser',
    {
      description: 'Creates a new user via post',
      isStatic: true,
      accepts: [
        {
          arg: 'user',
          required: true,
          type: 'User',
          http: { source: 'body' }
        },
        {
          arg: 'req',
          type: 'object',
          http: { source: 'req' }
        }
      ],
      returns: [
        {
          arg: 'payload',
          root: true,
          type: 'User'
        },
      ],
      http: { verb: 'post', path: '/users' }
    }
  );
};
