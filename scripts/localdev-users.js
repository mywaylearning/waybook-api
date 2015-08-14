'use strict';
var dotenv = require('dotenv');
dotenv.load();
var server = require('../server/server.js');

var details = {
  'stan@example.com': [{
    propertyName: 'firstName',
    propertyGroup: 'userInfo',
    valueType: 's',
    valueString: 'Stan'
  }, {
    propertyName: 'lastName',
    propertyGroup: 'userInfo',
    valueType: 's',
    valueString: 'Man'
  }, {
    propertyName: 'birthday',
    propertyGroup: 'userInfo',
    valueType: 'd',
    valueString: '1965-05-12'
  }],
  'chet@example.com': [{
    propertyName: 'firstName',
    propertyGroup: 'userInfo',
    valueType: 's',
    valueString: 'Chet'
  }, {
    propertyName: 'lastName',
    propertyGroup: 'userInfo',
    valueType: 's',
    valueString: 'Smith'
  }, {
    propertyName: 'birthday',
    propertyGroup: 'userInfo',
    valueType: 'd',
    valueString: '1972-02-17'
  }],
  'bob@example.com': [{
    propertyName: 'firstName',
    propertyGroup: 'userInfo',
    valueType: 's',
    valueString: 'Bob'
  }, {
    propertyName: 'lastName',
    propertyGroup: 'userInfo',
    valueType: 's',
    valueString: 'Jones'
  }, {
    propertyName: 'birthday',
    propertyGroup: 'userInfo',
    valueType: 'd',
    valueString: '1969-12-01'
  }]
};

var detail = [];
var detailItem = {};
var detailUpdates = [];

server.models.WaybookUser.create(
  [{
    email: 'stan@example.com',
    password: 'stan',
    firstName: 'stan',
  }, {
    email: 'chet@example.com',
    firstName: 'chet',
    password: 'chet'
  }, {
    email: 'bob@example.com',
    firstName: 'bob',
    password: 'bob'
  }],
  function(err, users) {

    if (err) {
      console.error('Error creating users', err);
      process.exit(1);
    }

    users.forEach(function(user) {
      detail = details[user.email];
      detail.forEach(function(item) {
        detailItem = item;
        detailItem.userId = user.id;
        detailUpdates.push(detailItem);
      });
    });

    server.models.WaybookUserDetail.create(detailUpdates, function(err, detailRecords) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(detailRecords);
      process.exit(0);
    });

    //process.exit(0);
  });
