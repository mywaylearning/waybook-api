(function() {

  'use strict';

  var debug = require('debug')('waybook:PostController');

  function PostController($scope, router, goal, SWAGGER) {
    debug('here we are (directive controller)');

    debug(SWAGGER);

    var ctrl = this;

    ctrl.model = {
      title: 'New Goal'
    };

    function init() {
      debug('type...? ' + ctrl.postType);
    }
    init();


    ctrl.save = function() {
      debug('saving...', ctrl.model);
      goal.create(ctrl.model);
    };

  }

  module.exports = ['$scope', 'router', 'goal', 'SWAGGER', PostController];

}());
