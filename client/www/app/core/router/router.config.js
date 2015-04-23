(function() {

  'use strict';

  var debug = require('debug')('waybook:RouterConfig');

  require('ionic');

  function RouterConfig($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, $locationProvider, ROLES) {
    var userResolve;

    $urlMatcherFactoryProvider.strictMode(false);
    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('!');

    userResolve = {
      userGrant: function(grant) {
        return grant.only([ROLES.user], ['public.login']);
      }
    };

    $stateProvider

    /**
     * CUSTOM DECORATOR
     * Because life is too short to type in full paths to template files.
     */
    .decorator('views', function(state, parent) {
      var result = {};
      var views = parent(state);

      var platform = '';
      // If we ever need platform-specific views, we'll use this
      // if (state.data && state.data.platformVariants !== undefined) {
      //   if (ionic.Platform.isAndroid()) {
      //     platform = '-droid-';
      //   } else if (ionic.Platform.isIOS()) {
      //     platform = '-ios-';
      //   }
      // }

      angular.forEach(views, function(config, name) {
        var section = state.name.replace(['app.', 'public.'], '');
        var n = '';
        if (name !== '@app' && name !== '@') {
          n = '.' + name;
        }
        var autoName = (section + n).replace(['@app', '@public'], '');
        config.templateUrl = config.templateUrl || '/app/sections/' + section + '/' + autoName + platform + '.html';
        result[name] = config;
      });
      return result;
    })

    .state('public', {
      abstract: true,
      template: '',
      controller: function($scope, currentUser) {
        debug($scope);
        $scope.app.user = currentUser;
      },
      resolve: {
        currentUser: function(user) {
          return user.currentUser();
        }
      }
    })


    .state('public.login', {
      url: '^/login',
      templateUrl: 'app/sections/public/login.html',
      controller: 'LoginController'
    })

    .state('app', {
      abstract: true,
      templateUrl: 'app/sections/app/base.html',
      controller: function($scope, currentUser) {
        debug($scope);
        $scope.app.user = currentUser;
      },
      resolve: {
        currentUser: function(user) {
          return user.currentUser();
        }
      }
    })


    .state('app.dashboard', {
      url: '^/dashboard',
      views: {
        'bodyContent': { controller: 'DashboardController' }
      },
      resolve: userResolve
    })

    .state('app.search', {
      url: '^/search',
      views: {
        'bodyContent': { controller: 'SearchController' }
      }
    })

    .state('app.browse', {
      url: '^/browse',
      views: {
        'bodyContent': { controller: 'BrowseController' }
      },
      resolve: userResolve
    })

    .state('app.playlists', {
      url: '^/playlists',
      views: {
        'bodyContent': { controller: 'PlaylistsController' }
      },
      data: {
        platformVariants: ['Android', 'IOS']
      }
    })

    .state('app.single', {
      url: '^/playlists/:playlistId',
      views: {
        'bodyContent': { controller: 'PlaylistController' }
      }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

  }

  RouterConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider', '$locationProvider', 'ROLES'];

  module.exports = RouterConfig;

}());
