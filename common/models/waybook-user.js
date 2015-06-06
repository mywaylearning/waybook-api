'use strict';

var debug = require('debug')('waybook:waybook-user');
var loopback = require('loopback');

module.exports = function(WaybookUser) {

  WaybookUser.getAuthenticatedUser = function(req, cb) {
    var currentUser = req.user;
    var filter = {fields: { username: false }};
    WaybookUser.findById(currentUser.id, filter, cb);
  };
};
