(function() {
  'use strict';

  var debug = require('debug')('waybook:PostService');

  function PostService(api, auth, router, utils, EVENTS, API_URL, POST_TYPES) {

    var svcInterface, Posts, postType, User, userObj;

    Posts = api.all('posts');
    postType = null;

    /**
     * Public
     */
    svcInterface = {
      setPostType: _setPostType,
      create: _create,
      collection: _collection,
      reset: _reset
    };
    return svcInterface;

    /**
     * Private
     */


    function _reset() {

    }

    function _setPostType(type) {
      postType = type;
    }


  }

}());
