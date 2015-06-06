(function() {
  'use strict';

  var debug = require('debug')('waybook:GoalService');

  function GoalService(api, EVENTS, API_URL) {

    var svcInterface, Goals, User, userObj;

    Goals = api.all('goals');

    /**
     * Public
     */
    svcInterface = {
      create: _create,
      collection: _collection,
      getById: _getById,
      reset: _reset
    };
    return svcInterface;

    /**
     * Private
     */


    function _reset() {

    }

    function _create(newGoal) {
      return Goals.post(newGoal);
    }

    function _collection() {
      debug('in _collection');
      return Goals.getList();
    }

    function _getById(id) {
      return api.one('goals', id).get();
    }
  }

  module.exports = ['api', 'EVENTS', 'API_URL', GoalService];

}());
