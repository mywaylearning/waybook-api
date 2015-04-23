'use strict';

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

    $rootScope.$on('$stateChangeSuccess', function(evt, toState, toParams, fromState) {
      $window.scrollTo(0, 0);
      if (toState.data) {

      } else {
        $rootScope.bodyClass = false;
      }
    });

  });
}

module.exports = ['$rootScope', '$window', '$ionicPlatform', AppRun];
