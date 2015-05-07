(function() {

  'use strict';

  var debug = require('debug')('waybook:GrantService');

  // based on https://github.com/Narzerus/angular-permission
  // Maybe eventually add a provider where you can set grant groups
  // so indstead of always having to do grant.only(['admin','user'])
  // you'd do grant.group('loggedin').only();
  //
  // add constant with availble ROLE names
      // ROLE.guest
      // ROLE.user
      // ROLE.admin etc..

    // In this error handler is where will handle redirecting the user to the proper page
    // The Role factory will have a provider that has a default redirect URL, this will be used when one is not provided with route
  function GrantService($q) {
    var svcInterface,
        _roles = [];

    /**
     * Public
     */
    svcInterface = {
      only: _only,
      except: _except,
      addRole: _addRole,
      hasRole: _hasRole
    };
    return svcInterface;

    /**
     * Private
     */
    function _addRole(role) {
      if (_hasRole(role.name)) {
        throw new Error('GrantService: Unable to add role because "' + role.name + '" role already exists!');
      }

      _roles.push(role);
    }

    function _hasRole(roleName) {
      var hasRole = _roles.some(function(role) {
        return (role.name === roleName);
      });

      return hasRole;
    }

    function _only(roles, states, stateParams) {
      return authorize(roles, states, true, stateParams);
    }

    function _except(roles, states, stateParams) {
      return authorize(roles, states, false, stateParams);
    }

    function authorize(whichRoles, states, resolveIfMatch, stateParams) {
      var matches = [],
          stateTo,
          deferred;

      debug('all roles ', _roles);
      states = parseStateParam(states);
      debug('authorize states ', states);


      // if a single value was given wrap in array
      if (!angular.isArray(whichRoles)) {
        whichRoles = [whichRoles];
      }
      debug('which roles ', whichRoles);
      debug('resolveIfMatch', resolveIfMatch);

      // find the roles we are trying to authorize
      _roles.forEach(function(role, index) {
        whichRoles.forEach(function(roleName) {
          if (roleName === role.name) {
            debug(roleName + ' is equal to ' + role.name);
            // if state params from the state were passed
            // make sure the role has access to them
            role.setStateParams(stateParams);

            // attempt to match this role with an accompanying
            // stateTo from the states array, if a match can not
            // be found default to the first stateTo in states
            stateTo = states[index - 1] || states[0];
            debug('stateTo', stateTo);

            matches.push(role.validate(stateTo, resolveIfMatch));
          }
        });
        debug('matches', matches);

      });

      deferred = $q.defer();
      $q.all(matches)
        .then(function(results) {
          deferred.resolve(results);
        })
        .catch(function(err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    function parseStateParam(states) {
      var parsedStates;

      parsedStates = angular.isArray(states) ? states : [states];

      return parsedStates;
    }
  }

  module.exports = ['$q', GrantService];

}());
