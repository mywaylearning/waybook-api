(function() {

  'use strict';

  var debug = require('debug')('waybook:AuthService');

  function AuthService($q, Restangular, authStore) {
    var svcInterface, Oauth, Refresh, token, headers, oauthToken;

    Oauth = Restangular.all('login');
    Refresh = Restangular.all('refresh');
    token = authStore.getAccessToken();
    headers = {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};
    oauthToken = null;

    svcInterface = {
      authenticate: _authenticate,
      authRefresh: _authRefresh,
      isAuthenticated: _isAuthenticated,
      destroy: _destroy,
      getAuthHeader: _getAuthHeader
    };
    return svcInterface;

    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */
    function param(obj) {
      var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

      for (name in obj) {
        value = obj[name];

        if (value instanceof Array) {
          for (i = 0; i < value.length; ++i) {
            subValue = value[i];
            fullSubName = name + '[' + i + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        }
        else if (value instanceof Object) {
          for (subName in value) {
            subValue = value[subName];
            fullSubName = name + '[' + subName + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        }
        else if (value !== undefined && value !== null) {
          query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
      }

      return query.length ? query.substr(0, query.length - 1) : query;
    }

    function _authenticate(username, password) {
      debug('_authenticate %s, %s', username, password);
      var data;

      if (oauthToken) {
        return oauthToken;
      }

      data = param({
        username: username,
        password: password,
        grant_type: 'password',
        scope: 'full'
      });

      oauthToken = Oauth.post(data, null, headers);

      oauthToken.then(saveAuth).finally(authComplete);

      return oauthToken;
    }


    function _authRefresh() {
      var data;

      if (oauthToken) {
        return oauthToken;
      }

      data = param({
        grant_type: 'refresh_token',
        refresh_token: authStore.getRefreshToken(),
        scope: 'full'
      });

      oauthToken = Refresh.post(data, null, headers);

      oauthToken.then(saveAuth).finally(authComplete);

      return oauthToken;
    }

    /**
     * This will return true or false depending on whether
     * a valid access token exists.
     *
     * If promisify is true a promise object will be returned that
     * will resolve if token exists and reject if it doesn't.
     *
       Usage:

       if (auth.isAuthenticated()) {}

       // promisify true
       auth.isAuthenticated(true).then()

     * @param  {Boolean}  promisify If true will return a promise
     * @return {mixed}              Can return Boolean or Promise
     */
    function _isAuthenticated(promisify) {

      if (promisify === undefined || !promisify) {
        debug('returning angular.isDefined token, token: %s', token);
        return angular.isDefined(token);
      }
      var deferred = $q.defer();

      if (angular.isDefined(token)) {
        deferred.resolve();
      }
      else {
        deferred.reject();
      }

      return deferred.promise;
    }

    /**
     * Will delete any information stored in local storage
     * in relation to auth for this user. e.g. access_token
     */
    function _destroy() {
      token = undefined;
      authStore.destroy();
    }

    /**
     * Generate API auth header using current access_token
     * @return {Object}
     */
    function _getAuthHeader() {
      var header = {
        'Authorization': 'Bearer ' + authStore.getAccessToken()
      };
      return header;
    }

    /**
     * Upon successful authentication save the access_token
     * and refresh_token for this user in local storage.
     * @param  {Object} data - response object from the auth endpoint
     */
    function saveAuth(data) {
      token = data.access_token;

      authStore.save({
        access_token: token,
        refresh_token: data.refresh_token
      });
    }

    /**
     * Clear all references to Restangular auth elements
     * used during authenticate and refresh calls.
     */
    function authComplete() {
      oauthToken = null;
    }
  }


  module.exports = ['$q', 'Restangular', 'authStore', AuthService];

}());
