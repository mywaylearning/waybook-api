'use strict';

var debug = require('debug')('waybook:AppRun');
var util = require('util');

function AppRun($rootScope, $window, $ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    $rootScope.$on('$stateNotFound', function(evt, unfoundState, fromState, fromParams) {
      debug(unfoundState.to);
      debug(unfoundState.toParams);
      debug(unfoundState.options);
    });

    // $rootScope.$on('$stateChangeStart', function(evt, toState, toParams, fromState, fromParams) {
    //   debug('$stateChangeStart');
    //   debug(toState);
    //   debug(toParams);
    //   debug(fromState);
    //   debug(fromParams);
    // });

    $rootScope.$on('$stateChangeError', function(evt, toState, toParams, fromState, fromParams, error) {
      debug('$stateChangeError');
      debug(toState);
      debug(toParams);
      debug(fromState);
      debug(fromParams);
      debug(error);
    });

    // $rootScope.$on('$stateChangeSuccess', function(evt, toState, toParams, fromState, fromParams) {
    //   debug('$stateChangeSuccess');
    //   debug(toState);
    //   debug(toParams);
    //   debug(fromState);
    //   debug(fromParams);
    // });

    // $rootScope.$on('$stateChangeSuccess', function(evt, toState, toParams, fromState) {
    //   $window.scrollTo(0, 0);
    //   if (toState.data) {
    //
    //   } else {
    //     $rootScope.bodyClass = false;
    //   }
    // });
    debug('platform is %s', ionic.Platform.platform());
    debug(ionic.Platform.platforms);
  });
}

module.exports = ['$rootScope', '$window', '$ionicPlatform', AppRun];
