(function() {

  'use strict';

  var debug = require('debug')('waybook:RoleService');

  function RoleService($q, $state, grant, ERROR) {

    function Role(roleName, validationFunction) {
      validateRoleParams(roleName, validationFunction);

      this.name = roleName;
      this.validateFunction = validationFunction;
      this.stateParams = undefined;

      grant.addRole(this);
    }

    Role.prototype.setStateParams = function(stateParams) {
      this.stateParams = stateParams;
    };

    Role.prototype.validate = function(stateTo, resolveIfMatch) {

      // add the stateTo property to the grant fail object
      // upon failed validation the user will be redirected
      // to the stateTo state
      this.grantFail = {
        type: ERROR.grantRejected,
        role: this.name,
        stateTo: stateTo
      };

      return promisify(this.validateFunction(), this, resolveIfMatch);
    };

    return Role;

    /**
     * Converts a value into a promise, if the value is truthy it resolves it,
     * otherwise it rejects it. Also provides the grantFail object to both resolve
     * and reject methods.
     * @param  {mixed} value
     * @return {promise}
     */
    function promisify(value, role, resolveIfMatch) {
      var deferred = $q.defer();

      if (value && angular.isFunction(value.then)) {

        value
          .then(function(response) {
            onRolePass(role, resolveIfMatch, deferred, response);
          })
          .catch(function() {
            onRoleFail(role, resolveIfMatch, deferred);
          });

        return deferred.promise;
      }

      if (value) {
        onRolePass(role, resolveIfMatch, deferred, value);
      }
      else {
        onRoleFail(role, resolveIfMatch, deferred);
      }

      return deferred.promise;
    }

    function onRolePass(role, resolveIfMatch, deferred, resolvedValue) {
      if (resolveIfMatch) {
        deferred.resolve(resolvedValue);
      }
      else {
        deferred.reject(role.grantFail);
      }
    }

    function onRoleFail(role, resolveIfMatch, deferred) {
      if (resolveIfMatch) {
        deferred.reject(role.grantFail);
      }
      else {
        deferred.resolve();
      }
    }

    function validateRoleParams(roleName, validationFunction) {
      if (!angular.isString(roleName)) {
        throw new Error('Role name must be a string');
      }
      if (!angular.isFunction(validationFunction)) {
        throw new Error('Validation function not a valid function');
      }
    }
  }

  module.exports = ['$q', '$state', 'grant', 'ERROR', RoleService];

}());
