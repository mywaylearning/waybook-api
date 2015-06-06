(function() {

  'use strict';

  var app = angular.module('waybook');

  app.controller('PostController', require('./post/post.controller.js'));
  app.directive('wayPost', require('./post/post.directive.js'));

  app.controller('FeedController', require('./feed/feed.controller.js'));
  app.directive('wayFeed', require('./feed/feed.directive.js'));

}());
