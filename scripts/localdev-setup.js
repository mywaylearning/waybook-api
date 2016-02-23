'use strict';

require('dotenv').load();

var server = require('../server/server.js');

/**
 * comment from @lesterzone
 * I'm not sure where or why this is needed, we just need this configuration
 * Keys and default information should be moved to .env variables, but, I'm not
 * sure if this will break anything else
 * TODO: move keys and secrets to .env and test if system works properly
 */
server.models.OAuth2ClientApplication.observe('before save', function(ctx, next) {
    ctx.instance.id = '4c794dd53729fa8f55b97df21e48c7b6';
    ctx.instance.clientSecret = 'a5d099b126700afec5acd5d2f5f94e33c5b6a419';
    next();
});

let userData = {
    email: 'dev@way.me',
    password: 'testing',
    firstName: 'dev'
};

server.models.WaybookUser.create(userData, function(err, user) {
    if (err) {
        console.error('Error creating dev user', err);
        return process.exit(1);
    }

    console.log('User created: email=%s, password=%s', user.email, 'testing');

    server.models.OAuth2ClientApplication.create({
        name: 'frontend',
        clientType: 'confidential',
        clientName: 'frontend',
        owner: user.id
    }, function(error, app) {
        if (error) {
            console.error(error);
            return process.exit(1);
        }

        console.log('Client app registered:', app.id);
        process.exit(0);
    });
});
