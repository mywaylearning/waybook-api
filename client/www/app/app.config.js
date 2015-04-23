(function() {
  'use strict';

  require('angular');

  angular.module('app.config', [])
  .constant('AUTH_URL', process.env.AUTH_URL)
  .constant('API_URL', process.env.API_URL)
  .constant('store', require('store'))
  .constant('Moment', require('moment'))
  //.constant('_', require('lodash'))
  //.constant('$', require('jquery'))

  .constant('ROLES', {
    'guest': 'way.guest',
    'user': 'way.user'
  })

  .constant('LOCAL_STORAGE_KEYS', {
    'auth': 'way.auth',
    'invitationToken': 'way.invitationToken',
    'invitationData': 'way.invitationData'
  })

  .constant('EVENTS', {
    'requestStart': 'way.request.start',
    'requestFinish': 'way.request.finish'
  })

  .constant('ERROR', {
    'grantRejected': 'way.grant.rejected',
    'unauthorizedRequest': 'way.unauthorized'
  })

  .constant('FORM_ERRORS', {
    'invalidLogin': 'OauthError',
    'userEmailTaken': 'EmailAlreadyInUse',
    'entityNotFound': 'EntityNotFound',
    'fileUploadTooLarge': 'FileUploadTooLarge',
    'invalidFileType': 'InvalidFileType'
  })

  .constant('DEFAULT_PER_PAGE', 20)

  .config(AppConfig);

  function AppConfig($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      'self'
    ]);
  }

  AppConfig.$inject = ['$sceDelegateProvider'];

}());
