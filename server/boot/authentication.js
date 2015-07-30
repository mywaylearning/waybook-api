var oauth2 = require('loopback-component-oauth2');

module.exports = function enableAuthentication(server) {

  var options = {
    resourceServer: true,
    dataSource: server.dataSources.db,
    userModel: server.dataSources.db.getModel('WaybookUser', true),
    applicationModel: server.dataSources.db.getModel(
      'OAuth2ClientApplication', true),

    authorizationServer: true,
    authorizePath: '/oauth/authorize',
    tokenPath: '/oauth/token',
    decisionPath: '/oauth/authorize/decision',

    loginPage: '/login',
    loginPath: false,

    supportedGrantTypes: [
      'authorizationCode',
      'refreshToken',
      'implicit',
      'resourceOwnerPasswordCredentials'
    ],

    getTTL: function(grantType, clientId, resourceOwner, scopes) {
      /**
       * Time in seconds to expire access token
       */
      return 24000;
    }
  };

  oauth2(server, options);

  var auth = oauth2.authenticate({
    session: false,
    scope: 'full'
  });

  server.middleware('auth:before', [
    '/me',
    '/Posts',
    '/Goals',
    // '/Users', POST to /users should be public
    '/User'
  ], auth);

  server.get('/me', function(request, response) {
    response.json({
      'user_id': request.user.id,
      name: request.user.username,
      accessToken: request.authInfo.accessToken
    });
  });
};
