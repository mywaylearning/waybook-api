(function() {

  'use strict';

  require('ionic');
  require('angular');
  require('angular-animate');
  require('angular-sanitize');
  require('angular-ui-router');
  require('ionic-angular');
  require('./app.config');
  require('restangular');

  window.debug = require('debug');

  //var _ = require('lodash');

  angular.module('waybook', [
    'ionic',
    'app.config',
    'ngAnimate',
    'ngSanitize',
    'ui.router',
    'restangular'
  ])

  .controller('AppController', require('./app.controller.js'))
  .factory('app', require('./app.service.js'))
  .run(require('./app.run.js'));

  require('./core');
  require('./sections');

}());