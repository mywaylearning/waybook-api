'use strict';

var server = require('../server/server.js');

server.models.WaybookUser.create([
  {
    email: 'stan@example.com',
    password: 'stan'
  },
  {
    email: 'chet@example.com',
    password: 'chet'
  },
  {
    email: 'bob@example.com',
    password: 'bob'
  }
], function(err, users) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(users);
  process.exit(0);
});
