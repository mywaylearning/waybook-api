'use strict';

var server = require('../server/server.js');

server.models.OAuthClientApplication.observe('before save', function(ctx, next) {
  ctx.instance.id = '4c794dd53729fa8f55b97df21e48c7b6';
  ctx.instance.clientSecret = 'a5d099b126700afec5acd5d2f5f94e33c5b6a419';
  next();
});

server.models.WaybookUser.create({
  email: 'dev@way.me',
  password: 'testing'
}, function(err, user) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log('User created: email=%s, password=%s', user.email, 'testing');

  server.models.OAuthClientApplication.create({
    name: 'frontend',
    clientType: 'confidential',
    clientName: 'frontend',
    owner: user.id
  }, function (er, clientApp) {
      if (er) {
        console.error(er);
        process.exit(1);
      }
      console.log("Client app registered: clientId=%s, clientSecret=%s", clientApp.id, clientApp.clientSecret);
      process.exit(0);
    }
  )
});