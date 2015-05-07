(function() {

  'use strict';

  var app = angular.module('waybook');
  app.controller('LoginController', require('./login/login.controller.js'));
  app.controller('DashboardController', require('./dashboard/dashboard.controller.js'));
  app.controller('DiscoverController', require('./discover/discover.controller.js'));
  app.controller('ExplorationController', require('./discover/exploration.controller.js'));
  app.controller('PlanController', require('./plan/plan.controller.js'));
  app.controller('UniteController', require('./unite/unite.controller.js'));
  app.controller('MeController', require('./me/me.controller.js'));
  app.controller('HelpFeedbackController', require('./help-feedback/help-feedback.controller.js'));
  app.controller('AboutController', require('./about/about.controller.js'));
  app.controller('IntroController', require('./intro/intro.controller.js'));

    //app.controller('SearchController', require('./search/search.controller.js'));
  //app.controller('BrowseController', require('./browse/browse.controller.js'));

  //app.controller('PlaylistsController', require('./playlists/playlists.controller.js'));
  //app.controller('PlaylistController', require('./playlist/playlist.controller.js'));

}());
