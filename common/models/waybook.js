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
   * GET /admin/tasks
   *
   * Returns a collection of guide taks for the authenticated user
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Collection|UnexpectedError} result Result object
   * @see Guide.getTask
   */
  Waybook.getTask = function(request, callback) {
    Waybook.app.models.Task.index(request, callback);
  };

  /**
   * Remote method hook for GET /admin/tasks
   *
   * @see Guide.getTask
   */
  Waybook.remoteMethod(
    'getTask',
    {
      description: 'Returns a collection of guide taks for the authenticated user',
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
      http: { verb: 'get', path: '/admin/tasks' }
    }
  );

  /**
   * PUT /admin/tasks/:id
   *
   * Update task
   * @param {String} id
   * @param {#/definitions/PatchDocument} patch
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Task} result Result object
   * @see Tasks.updateTask
   */
  Waybook.updateTask = function(id, patch, request, callback) {
    Waybook.app.models.Task.updateTask(id, patch, request, callback);
  };

  /**
   * Remote method hook for PUT /admin/tasks/:id
   *
   * @see Tasks.updateTask
   */
  Waybook.remoteMethod(
    'updateTask',
    {
      description: 'Update task',
      isStatic: true,
      accepts: [
        {
          arg: 'id',
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
      http: { verb: 'put', path: '/admin/tasks/:id' }
    }
  );

  /**
   * GET /admin/users
   *
   * Return an object with public filtered user information
   * @param {String} search Text to search users that starts with input criteria
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {AdminUsers|UnexpectedError} result Result object
   * @see Users.usersIndex
   */
  Waybook.usersIndex = function(search, request, callback) {
    Waybook.app.models.WaybookUser.usersIndex(search, request, callback);
  };

  /**
   * Remote method hook for GET /admin/users
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
          type: 'AdminUsers'
        },
      ],
      http: { verb: 'get', path: '/admin/users' }
    }
  );

  /**
   * DELETE /admin/users/:id
   *
   * Removes an user
   * @param {String} id ID required to delete a user
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {User} result Result object
   * @see Users.adminDeleteUser
   */
  Waybook.adminDeleteUser = function(id, request, callback) {
    Waybook.app.models.WaybookUser.adminDeleteUser(id, request, callback);
  };

  /**
   * Remote method hook for DELETE /admin/users/:id
   *
   * @see Users.adminDeleteUser
   */
  Waybook.remoteMethod(
    'adminDeleteUser',
    {
      description: 'Removes an user',
      isStatic: true,
      accepts: [
        {
          arg: 'id',
          description: 'ID required to delete a user',
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
          type: 'User'
        },
      ],
      http: { verb: 'delete', path: '/admin/users/:id' }
    }
  );

  /**
   * GET /admin/users/:id
   *
   * Returns a user based on provided id
   * @param {String} id ID required to fetch a user
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {AdminUsers|UnexpectedError} result Result object
   * @see Users.getUser
   */
  Waybook.getUser = function(id, request, callback) {
    Waybook.app.models.WaybookUser.getUser(id, request, callback);
  };

  /**
   * Remote method hook for GET /admin/users/:id
   *
   * @see Users.getUser
   */
  Waybook.remoteMethod(
    'getUser',
    {
      description: 'Returns a user based on provided id',
      isStatic: true,
      accepts: [
        {
          arg: 'id',
          description: 'ID required to fetch a user',
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
          type: 'AdminUsers'
        },
      ],
      http: { verb: 'get', path: '/admin/users/:id' }
    }
  );

  /**
   * GET /categories
   *
   * Returns a collection of categories
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Collection|UnexpectedError} result Result object
   * @see Categories.indexCategory
   */
  Waybook.indexCategory = function(request, callback) {
    Waybook.app.models.Category.indexCategory(request, callback);
  };

  /**
   * Remote method hook for GET /categories
   *
   * @see Categories.indexCategory
   */
  Waybook.remoteMethod(
    'indexCategory',
    {
      description: 'Returns a collection of categories',
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
      http: { verb: 'get', path: '/categories' }
    }
  );

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
   * GET /contacts/:id
   *
   * Returns a contact based on provided id
   * @param {String} id ID required to fetch a contact
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Contact|UnexpectedError} result Result object
   * @see Contacts.getContact
   */
  Waybook.getContact = function(id, request, callback) {
    Waybook.app.models.Contact.getContact(id, request, callback);
  };

  /**
   * Remote method hook for GET /contacts/:id
   *
   * @see Contacts.getContact
   */
  Waybook.remoteMethod(
    'getContact',
    {
      description: 'Returns a contact based on provided id',
      isStatic: true,
      accepts: [
        {
          arg: 'id',
          description: 'ID required to fetch a contact',
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
      http: { verb: 'get', path: '/contacts/:id' }
    }
  );

  /**
   * PUT /contacts/:id
   *
   * Alter a Contact using JSON-Patch
   * @param {String} id ID required to update a contact
   * @param {#/definitions/PatchDocument} patch
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Contact} result Result object
   * @see Contacts.updateContact
   */
  Waybook.updateContact = function(id, patch, request, callback) {
    Waybook.app.models.Contact.put(id, patch, request, callback);
  };

  /**
   * Remote method hook for PUT /contacts/:id
   *
   * @see Contacts.updateContact
   */
  Waybook.remoteMethod(
    'updateContact',
    {
      description: 'Alter a Contact using JSON-Patch',
      isStatic: true,
      accepts: [
        {
          arg: 'id',
          description: 'ID required to update a contact',
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
      http: { verb: 'put', path: '/contacts/:id' }
    }
  );

  /**
   * GET /dashboard
   *
   * Returns dashboard data
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Collection|UnexpectedError} result Result object
   * @see Dashboard.dashboard
   */
  Waybook.dashboard = function(request, callback) {
    Waybook.app.models.WaybookUser.dashboard(request, callback);
  };

  /**
   * Remote method hook for GET /dashboard
   *
   * @see Dashboard.dashboard
   */
  Waybook.remoteMethod(
    'dashboard',
    {
      description: 'Returns dashboard data',
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
      http: { verb: 'get', path: '/dashboard' }
    }
  );

  /**
   * GET /explorations
   *
   * Returns a collection of Explorations
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Collection|UnexpectedError} result Result object
   * @see Explorations.indexExploration
   */
  Waybook.indexExploration = function(request, callback) {
    Waybook.app.models.Exploration.indexExploration(request, callback);
  };

  /**
   * Remote method hook for GET /explorations
   *
   * @see Explorations.indexExploration
   */
  Waybook.remoteMethod(
    'indexExploration',
    {
      description: 'Returns a collection of Explorations',
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
      http: { verb: 'get', path: '/explorations' }
    }
  );

  /**
   * GET /explorations/:id
   *
   * Returns a Exploration based on provided slug
   * @param {String} id slug required to fetch a Exploration
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Exploration|UnexpectedError} result Result object
   * @see Explorations.getExploration
   */
  Waybook.getExploration = function(id, request, callback) {
    Waybook.app.models.Exploration.getExploration(id, request, callback);
  };

  /**
   * Remote method hook for GET /explorations/:id
   *
   * @see Explorations.getExploration
   */
  Waybook.remoteMethod(
    'getExploration',
    {
      description: 'Returns a Exploration based on provided slug',
      isStatic: true,
      accepts: [
        {
          arg: 'id',
          description: 'slug required to fetch a Exploration',
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
          type: 'Exploration'
        },
      ],
      http: { verb: 'get', path: '/explorations/:id' }
    }
  );

  /**
   * PUT /explorations/:id
   *
   * Alter a Exploration using JSON-Patch
   * @param {String} id ID required to update a record
   * @param {#/definitions/PatchDocument} patch
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Exploration} result Result object
   * @see Explorations.updateExploration
   */
  Waybook.updateExploration = function(id, patch, request, callback) {
    Waybook.app.models.Exploration.put(id, patch, request, callback);
  };

  /**
   * Remote method hook for PUT /explorations/:id
   *
   * @see Explorations.updateExploration
   */
  Waybook.remoteMethod(
    'updateExploration',
    {
      description: 'Alter a Exploration using JSON-Patch',
      isStatic: true,
      accepts: [
        {
          arg: 'id',
          description: 'ID required to update a record',
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
      http: { verb: 'put', path: '/explorations/:id' }
    }
  );

  /**
   * GET /guide
   *
   * Returns a collection of guide taks for the authenticated user
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Collection|UnexpectedError} result Result object
   * @see Guide.index
   */
  Waybook.index = function(request, callback) {
    Waybook.app.models.TaskRecords.index(request, callback);
  };

  /**
   * Remote method hook for GET /guide
   *
   * @see Guide.index
   */
  Waybook.remoteMethod(
    'index',
    {
      description: 'Returns a collection of guide taks for the authenticated user',
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
      http: { verb: 'get', path: '/guide' }
    }
  );

  /**
   * GET /posts
   *
   * Returns a collection of xposts for the authenticated user
   * @param {String} postType Type of post to query
   * @param {String} tag Tag to return all posts with it
   * @param {String} timeline get timeline information
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Collection|UnexpectedError} result Result object
   * @see Posts.indexPost
   */
  Waybook.indexPost = function(postType, tag, timeline, request, callback) {
    Waybook.app.models.Post.indexPost(postType, tag, timeline, request, callback);
  };

  /**
   * Remote method hook for GET /posts
   *
   * @see Posts.indexPost
   */
  Waybook.remoteMethod(
    'indexPost',
    {
      description: 'Returns a collection of xposts for the authenticated user',
      isStatic: true,
      accepts: [
        {
          arg: 'postType',
          description: 'Type of post to query',
          required: false,
          type: 'string',
          http: { source: 'query' }
        },
        {
          arg: 'tag',
          description: 'Tag to return all posts with it',
          required: false,
          type: 'string',
          http: { source: 'query' }
        },
        {
          arg: 'timeline',
          description: 'get timeline information',
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
      http: { verb: 'get', path: '/posts' }
    }
  );

  /**
   * POST /posts
   *
   * Creates a new Post
   * @param {#/definitions/Post} post
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Post} result Result object
   * @see Posts.createPost
   */
  Waybook.createPost = function(post, request, callback) {
    Waybook.app.models.Post.createPost(post, request, callback);
  };

  /**
   * Remote method hook for POST /posts
   *
   * @see Posts.createPost
   */
  Waybook.remoteMethod(
    'createPost',
    {
      description: 'Creates a new Post',
      isStatic: true,
      accepts: [
        {
          arg: 'post',
          description: 'A Post object',
          required: true,
          type: 'Post',
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
          type: 'Post'
        },
      ],
      http: { verb: 'post', path: '/posts' }
    }
  );

  /**
   * DELETE /posts/:id
   *
   * Removes a post
   * @param {String} id ID required to delete a post
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Post} result Result object
   * @see Posts.deletePost
   */
  Waybook.deletePost = function(id, request, callback) {
    Waybook.app.models.Post.deletePost(id, request, callback);
  };

  /**
   * Remote method hook for DELETE /posts/:id
   *
   * @see Posts.deletePost
   */
  Waybook.remoteMethod(
    'deletePost',
    {
      description: 'Removes a post',
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
          type: 'Post'
        },
      ],
      http: { verb: 'delete', path: '/posts/:id' }
    }
  );

  /**
   * GET /posts/:id
   *
   * Returns a xpost based on provided id
   * @param {String} id ID required to fetch a xpost
   * @param {String} shared return all contacts where xpost has been shared with
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Post|UnexpectedError} result Result object
   * @see Posts.getPost
   */
  Waybook.getPost = function(id, shared, request, callback) {
    Waybook.app.models.Post.getPost(id, shared, request, callback);
  };

  /**
   * Remote method hook for GET /posts/:id
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
          type: 'Post'
        },
      ],
      http: { verb: 'get', path: '/posts/:id' }
    }
  );

  /**
   * PUT /posts/:id
   *
   * Alter a Post using JSON-Patch
   * @param {String} id ID required to delete a post
   * @param {#/definitions/PatchDocument} patch
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Post} result Result object
   * @see Posts.updatePost
   */
  Waybook.updatePost = function(id, patch, request, callback) {
    Waybook.app.models.Post.put(id, patch, request, callback);
  };

  /**
   * Remote method hook for PUT /posts/:id
   *
   * @see Posts.updatePost
   */
  Waybook.remoteMethod(
    'updatePost',
    {
      description: 'Alter a Post using JSON-Patch',
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
      http: { verb: 'put', path: '/posts/:id' }
    }
  );

  /**
   * GET /search
   *
   * Search by tags
   * @param {String} tag Text to search objects
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Collection|UnexpectedError} result Result object
   * @see Search.index
   */
  Waybook.index = function(tag, request, callback) {
    Waybook.app.models.Post.search(tag, request, callback);
  };

  /**
   * Remote method hook for GET /search
   *
   * @see Search.index
   */
  Waybook.remoteMethod(
    'index',
    {
      description: 'Search by tags',
      isStatic: true,
      accepts: [
        {
          arg: 'tag',
          description: 'Text to search objects',
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
      http: { verb: 'get', path: '/search' }
    }
  );

  /**
   * GET /tags
   *
   * Returns a collection of tags for the authenticated user
   * @param {String} search Text to search tags that starts with
   * @param {String} timeline Param to request all tags from all posts for current user
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {Collection|UnexpectedError} result Result object
   * @see Tags.tagsIndex
   */
  Waybook.tagsIndex = function(search, timeline, request, callback) {
    Waybook.app.models.Tag.tagsIndex(search, timeline, request, callback);
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
          required: false,
          type: 'string',
          http: { source: 'query' }
        },
        {
          arg: 'timeline',
          description: 'Param to request all tags from all posts for current user',
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
   * PUT /user
   *
   * Update user
   * @param {#/definitions/PatchDocument} patch
   * @param {Object} req Request object
   * @callback {Function} cb Callback function
   * @param {Error|string} err Error object
   * @param {User} result Result object
   * @see Users.updateUser
   */
  Waybook.updateUser = function(patch, request, callback) {
    Waybook.app.models.WaybookUser.put(patch, request, callback);
  };

  /**
   * Remote method hook for PUT /user
   *
   * @see Users.updateUser
   */
  Waybook.remoteMethod(
    'updateUser',
    {
      description: 'Update user',
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
      http: { verb: 'put', path: '/user' }
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
