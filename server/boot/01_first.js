'use strict';
var debug = require('debug')('waybook:firstBoot');

module.exports = function firstBoot(server) {

  debug('here we are');
  server.loopback.Model.extend('User', {
      realm: false,
      emailVerified: false,
      verificationToken: false,
      credentials: false,
      challenges: false
    }, {
      mysql: {
        table: 'waybook_user'
      }
    }
  );

};
