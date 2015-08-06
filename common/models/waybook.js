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
   * POST /comments
   *
   * Creates a new comment via post
   * @param {#/definitions/Comment} comment
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Comment|Error} result Result object
   * @see Comments.createComment
   */
  Waybook.createComment = function(comment, request, callback) {
    Waybook.app.models.Comment.createComment(comment, request, callback);
  };

  /**
   * Remote method hook for POST /comments
   *
   * @see Comments.createComment
   */
  Waybook.remoteMethod(
    'createComment',
    {
      description: 'Creates a new comment via post',
      isStatic: true,
      accepts: [
        {
          arg: 'comment',
          required: true,
          type: 'Comment',
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
          type: 'Comment'
        },
      ],
      http: { verb: 'post', path: '/comments' }
    }
  );

  /**
   * GET /contacts
   *
   * Returns a collection of contacts for the authenticated user
   * @param {String} userId User.id associated to retrieve contacts
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Collection|UnexpectedError} result Result object
   * @see Contacts.contactsIndex
   */
  Waybook.contactsIndex = function(userId, request, callback) {
    Waybook.app.models.Contact.contactsIndex(userId, request, callback);
  };

  /**
   * Remote method hook for GET /contacts
   *
   * @see Contacts.contactsIndex
   */
  Waybook.remoteMethod(
    'contactsIndex',
    {
      description: 'Returns a collection of contacts for the authenticated user',
      isStatic: true,
      accepts: [
        {
          arg: 'userId',
          description: 'User.id associated to retrieve contacts',
          required: true,
          type: 'string',
          http: { source: 'query' }
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
          type: 'Collection'
        },
      ],
      http: { verb: 'get', path: '/contacts' }
    }
  );

  /**
   * POST /contacts
   *
   * Creates a new contact
   * @param {#/definitions/Contact} contact
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Contact|Error} result Result object
   * @see Contacts.createContact
   */
  Waybook.createContact = function(contact, request, callback) {
    Waybook.app.models.Contact.createContact(contact, request, callback);
  };

  /**
   * Remote method hook for POST /contacts
   *
   * @see Contacts.createContact
   */
  Waybook.remoteMethod(
    'createContact',
    {
      description: 'Creates a new contact',
      isStatic: true,
      accepts: [
        {
          arg: 'contact',
          required: true,
          type: 'Contact',
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
          type: 'Contact'
        },
      ],
      http: { verb: 'post', path: '/contacts' }
    }
  );

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
  Waybook.listGoals = function(request, callback) {
    Waybook.app.models.Goal.listGoals(request, callback);
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
  Waybook.patchGoal = function(patch, request, callback) {
    Waybook.app.models.Goal.patch(patch, request, callback);
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
  Waybook.createNewGoal = function(goal, request, callback) {
    Waybook.app.models.Goal.createNewGoal(goal, request, callback);
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
   * GET /tags
   *
   * Returns a collection of tags for the authenticated user
   * @param {String} search Text to search tags that starts with
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Collection|UnexpectedError} result Result object
   * @see Tags.tagsIndex
   */
  Waybook.tagsIndex = function(search, request, callback) {
    Waybook.app.models.Tag.tagsIndex(search, request, callback);
  };

  /**
   * Remote method hook for GET /tags
   *
   * @see Tags.tagsIndex
   */
  Waybook.remoteMethod(
    'tagsIndex',
    {
      description: 'Returns a collection of tags for the authenticated user',
      isStatic: true,
      accepts: [
        {
          arg: 'search',
          description: 'Text to search tags that starts with',
          required: true,
          type: 'string',
          http: { source: 'query' }
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
          type: 'Collection'
        },
      ],
      http: { verb: 'get', path: '/tags' }
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
  Waybook.getAuthenticatedUser = function(request, callback) {
    Waybook.app.models.WaybookUser.getAuthenticatedUser(request, callback);
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
   * GET /users
   *
   * Return an object with public filtered user information
   * @param {String} search Text to search users that starts with input criteria
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Collection|UnexpectedError} result Result object
   * @see Users.usersIndex
   */
  Waybook.usersIndex = function(search, request, callback) {
    Waybook.app.models.WaybookUser.usersIndex(search, request, callback);
  };

  /**
   * Remote method hook for GET /users
   *
   * @see Users.usersIndex
   */
  Waybook.remoteMethod(
    'usersIndex',
    {
      description: 'Return an object with public filtered user information',
      isStatic: true,
      accepts: [
        {
          arg: 'search',
          description: 'Text to search users that starts with input criteria',
          required: false,
          type: 'string',
          http: { source: 'query' }
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
          type: 'Collection'
        },
      ],
      http: { verb: 'get', path: '/users' }
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
  Waybook.createUser = function(user, request, callback) {
    Waybook.app.models.WaybookUser.createUser(user, request, callback);
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
