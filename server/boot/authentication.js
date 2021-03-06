'use strict';

var oauth2 = require('loopback-component-oauth2');
var hat = require('hat');
var addEvent = require('../../common/lib/addEvent');

module.exports = function enableAuthentication(server) {

    /**
     * WORKAROUND!
     * Since I'm not able to get WaybookUser.login working, using our config
     * I can set content manually
     * @ref https://github.com/strongloop/loopback/issues/175
     */
    server.models.OAuthAccessToken.observe('before save', function(ctx, next) {
        ctx.instance.appId = '4c794dd53729fa8f55b97df21e48c7b6';
        ctx.instance.id = hat();
        ctx.instance.refreshToken = hat();
        ctx.instance.scopes = ['full'];
        ctx.instance.expiresIn = 172800;
        ctx.instance.issuedAt = new Date();
        next();
    });

    server.models.Record.observe('after save', function(context, next) {

        if (context.instance && context.instance.question === '1') {
            context.action = 'EXPLORATION_STARTED';
            addEvent(context, server.models.Record);
        }

        next();
    });

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

        getTTL: function( /*grantType, clientId, resourceOwner, scopes*/ ) {
            /**
             * Time in seconds to expire access token
             */
            return 172800;
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
        '/Tags',
        '/contacts',
        '/explorations',
        '/comments',
        '/dashboard',
        '/guide',
        '/search',

        /**
         * Admin routes
         */
        '/admin/users/:id',
        '/admin/users',
        '/admin/tasks/:id',
        '/admin/tasks',

        // '/Users', POST to /users should be public
        '/User',
        '/reporting'
    ], auth);

    server.get('/me', function(request, response) {
        response.json({
            'user_id': request.user.id,
            name: request.user.username,
            accessToken: request.authInfo.accessToken
        });
    });
};
