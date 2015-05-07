var debug = require('debug')('waybook:modelTweaks');

module.exports = function modelTweaks(server) {

  var OAuth2ClientApplication = server.models.OAuth2ClientApplication;
  var WaybookUser = server.models.WaybookUser;

  // Because loopback-component-oauth2 doesn't let us customize the Access token model
  server.loopback.Model.extend('OAuthAccessToken', {
      userId: 'number'
    }, {
      mysql: {
        table: 'oauth2_access_token'
      }
    }
  );

  var OAuthAccessToken = server.models.OAuthAccessToken;
  OAuthAccessToken.belongsTo(OAuth2ClientApplication, {
    as: 'application',
    foreignKey: 'appId'
  });
  OAuthAccessToken.belongsTo(WaybookUser, {
    as: 'user',
    foreignKey: 'userId'
  });

  server.loopback.Model.extend('OAuthScope', {}, {
    mysql: {
      table: 'oauth2_scope'
    }
  });

  server.loopback.Model.extend('OAuthScopeMapping', {}, {
    mysql: {
      table: 'oauth2_scope_mapping'
    }
  });

  server.loopback.Model.extend('OAuthPermission', {}, {
    mysql: {
      table: 'oauth2_permission'
    }
  });

  server.loopback.Model.extend('OAuthAuthorizationCode', { userId: 'number' }, {
    mysql: {
      table: 'oauth2_authorization_code'
    }
  });

  server.loopback.Model.extend('RoleMapping', {}, {
    mysql: {
      table: 'role_mapping'
    }
  });

  server.loopback.Model.extend('Role', {}, {
    mysql: {
      table: 'role'
    }
  });

  server.loopback.Model.extend('ACL', {}, {
    mysql: {
      table: 'acl'
    }
  });
};
