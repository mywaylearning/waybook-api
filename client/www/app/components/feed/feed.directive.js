(function() {

  'use strict';

  function wayFeed() {

    return {
      restrict: 'EA',
      scope: {
        type: '=',
        feed: '=?'
      },
      controller: 'FeedController',
      controllerAs: 'fctrl',
      bindToController: true,
      templateUrl: '/app/components/feed/feed.html'
    };
  }

  module.exports = wayFeed;

}());
