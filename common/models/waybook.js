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
   * DELETE /comments/:id
   *
   * Removes a comment
   * @param {String} id ID required to delete a comment
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Comment} result Result object
   * @see Comments.deleteComment
   */
  Waybook.deleteComment = function(id, request, callback) {
    Waybook.app.models.Comment.deleteComment(id, request, callback);
  };

  /**
   * Remote method hook for DELETE /comments/:id
   *
   * @see Comments.deleteComment
   */
  Waybook.remoteMethod(
    'deleteComment',
    {
      description: 'Removes a comment',
      isStatic: true,
      accepts: [
        {
          arg: 'id',
          description: 'ID required to delete a comment',
          required: true,
          type: 'string',
          http: { source: 'path' }
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
      http: { verb: 'delete', path: '/comments/:id' }
    }
  );

  /**
   * PUT /comments/:id
   *
   * Alter a Comment
   * @param {String} id ID required to delete a post
   * @param {#/definitions/PatchDocument} comment
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Comment} result Result object
   * @see Comments.updateComment
   */
  Waybook.updateComment = function(id, comment, request, callback) {
    Waybook.app.models.Comment.put(id, comment, request, callback);
  };

  /**
   * Remote method hook for PUT /comments/:id
   *
   * @see Comments.updateComment
   */
  Waybook.remoteMethod(
    'updateComment',
    {
      description: 'Alter a Comment',
      isStatic: true,
      accepts: [
        {
          arg: 'id',
          description: 'ID required to delete a post',
          required: true,
          type: 'string',
          http: { source: 'path' }
        },
        {
          arg: 'comment',
          description: 'Patch document describing alterations.',
          required: true,
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
      http: { verb: 'put', path: '/comments/:id' }
    }
  );

  /**
   * GET /contacts
   *
   * Returns a collection of contacts for the authenticated user
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Collection|UnexpectedError} result Result object
   * @see Contacts.contactsIndex
   */
  Waybook.contactsIndex = function(request, callback) {
    Waybook.app.models.Contact.contactsIndex(request, callback);
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
   * DELETE /contacts/:id
   *
   * Removes a contact
   * @param {String} id ID required to delete a contact
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Contact} result Result object
   * @see Contacts.deleteContact
   */
  Waybook.deleteContact = function(id, request, callback) {
    Waybook.app.models.Contact.deleteContact(id, request, callback);
  };

  /**
   * Remote method hook for DELETE /contacts/:id
   *
   * @see Contacts.deleteContact
   */
  Waybook.remoteMethod(
    'deleteContact',
    {
      description: 'Removes a contact',
      isStatic: true,
      accepts: [
        {
          arg: 'id',
          description: 'ID required to delete a contact',
          required: true,
          type: 'string',
          http: { source: 'path' }
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
      http: { verb: 'delete', path: '/contacts/:id' }
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
   * DELETE /goals/:id
   *
   * Removes a goal
   * @param {String} id ID required to delete a post
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Goal} result Result object
   * @see Goals.deletePost
   */
  Waybook.deletePost = function(id, request, callback) {
    Waybook.app.models.Goal.deletePost(id, request, callback);
  };

  /**
   * Remote method hook for DELETE /goals/:id
   *
   * @see Goals.deletePost
   */
  Waybook.remoteMethod(
    'deletePost',
    {
      description: 'Removes a goal',
      isStatic: true,
      accepts: [
        {
          arg: 'id',
          description: 'ID required to delete a post',
          required: true,
          type: 'string',
          http: { source: 'path' }
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
      http: { verb: 'delete', path: '/goals/:id' }
    }
  );

  /**
   * GET /goals/:id
   *
   * Returns a xpost based on provided id
   * @param {String} id ID required to fetch a xpost
   * @param {String} shared return all contacts where xpost has been shared with
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Goal|UnexpectedError} result Result object
   * @see Posts.getPost
   */
  Waybook.getPost = function(id, shared, request, callback) {
    Waybook.app.models.Goal.getPost(id, shared, request, callback);
  };

  /**
   * Remote method hook for GET /goals/:id
   *
   * @see Posts.getPost
   */
  Waybook.remoteMethod(
    'getPost',
    {
      description: 'Returns a xpost based on provided id',
      isStatic: true,
      accepts: [
        {
          arg: 'id',
          description: 'ID required to fetch a xpost',
          required: true,
          type: 'string',
          http: { source: 'path' }
        },
        {
          arg: 'shared',
          description: 'return all contacts where xpost has been shared with',
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
          type: 'Goal'
        },
      ],
      http: { verb: 'get', path: '/goals/:id' }
    }
  );

  /**
   * PUT /goals/:id
   *
   * Alter a Goal using JSON-Patch
   * @param {String} id ID required to delete a post
   * @param {#/definitions/PatchDocument} patch
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Goal} result Result object
   * @see Goals.patchGoal
   */
  Waybook.patchGoal = function(id, patch, request, callback) {
    Waybook.app.models.Goal.put(id, patch, request, callback);
  };

  /**
   * Remote method hook for PUT /goals/:id
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
          arg: 'id',
          description: 'ID required to delete a post',
          required: true,
          type: 'string',
          http: { source: 'path' }
        },
        {
          arg: 'patch',
          description: 'Patch document describing alterations.',
          required: true,
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
      http: { verb: 'put', path: '/goals/:id' }
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
