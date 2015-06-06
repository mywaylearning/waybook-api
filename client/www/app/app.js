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
  require('ionic-ion-showWhen');
  require('ion-wizard');
  require('angular-gravatar');
  require('moment');
  require('angular-moment');

  require('ObjectPath');
  require('tv4');

  require('angular-schema-form');

  window.debug = require('debug');

  //var _ = require('lodash');

  angular.module('waybook', [
    'ionic',
    'ionic.ion.showWhen',
    'ionic.wizard',
    'app.config',
    'ngAnimate',
    'ngSanitize',
    'ui.router',
    'ui.gravatar',
    'restangular',
    'schemaForm',
    'angularMoment'
  ])

  .controller('AppController', require('./app.controller.js'))
  .factory('app', require('./app.service.js'))
  .run(require('./app.run.js'));

  require('./core');
  require('./components');
  require('./sections');

}());
