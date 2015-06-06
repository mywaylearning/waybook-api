(function() {

  'use strict';

  function wayPost() {

    return {
      restrict: 'EA',
      scope: {
        postType: '@type'
      },
      controller: 'PostController',
      controllerAs: 'ctrl',
      bindToController: true,
      templateUrl: '/app/components/post/post.html'
    };
  }

  module.exports = wayPost;

}());
