(function() {

  'use strict';

  var app = angular.module('waybook');
  app.controller('LoginController', require('./login/login.controller.js'));
  app.controller('SearchController', require('./search/search.controller.js'));
  app.controller('BrowseController', require('./browse/browse.controller.js'));

  app.controller('PlaylistsController', require('./playlists/playlists.controller.js'));
  app.controller('PlaylistController', require('./playlist/playlist.controller.js'));

}());
