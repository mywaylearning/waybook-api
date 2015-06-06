var oauth2 = require('loopback-component-oauth2');
var debug = require('debug')('waybook:boot:enableAuthentication');

module.exports = function enableAuthentication(server) {

  // enable authentication RBAC system
  // see loopback/lib/application.js
  //server.enableAuth();

  // userModel explicitly set here,
  // in case you cooked up your own versions of those which don't
  // inherit from LoopBack built-ins.

  // var WaybookUser = server.models.WaybookUser;
  // var OAuthClientApplication = server.models.OAuthClientApplication;

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
      return 9000;
    }
  };

  oauth2(server, options);

  var auth = oauth2.authenticate({ session: false, scope: 'full' });
  server.middleware('auth:before', [
    '/me',
    '/Posts',
    '/Goals',
    '/Users',
    '/User'
  ], auth);

  server.get('/me', function(req, res) {
    //console.dir(req);
    res.json({ 'user_id': req.user.id, name: req.user.username,
      accessToken: req.authInfo.accessToken });
  });
  //
  // var setCurrentUser = function(req, res, next) {
  //   // how do we check
  //   server.models.WaybookUser.getAuthenticatedUser(req, function(err, user) {
  //
  //   });
  // };
  // server.use(setCurrentUser);

};
