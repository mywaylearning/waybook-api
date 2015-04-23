'use strict';

function RestangularRun($rootScope, $http, Restangular, auth, authStore, ERROR) {

  /**
   * Configure any request interceptors that we want to add to our
   * requests before sending to the API.
   *
   * see https://github.com/mgonto/restangular#addrequestinterceptor
   */
  Restangular.addRequestInterceptor(function(elem, operation, model, url) {
    return elem;
  });

  /**
   * Configure custom error interceptors to handle any errors that
   * come back form the API.
   *
   * see https://github.com/mgonto/restangular#seterrorinterceptor
   */
  Restangular.setErrorInterceptor(function(response, deferred) {
   var stopErrorPropagation = false;

   //console.log('error interceptor called', response);

   switch (response.status) {
     case 401:
       handleUnauthorized(response, deferred);
       stopErrorPropagation = true;
     break;

     case 403:
       handleExpiredToken(response, deferred);
       stopErrorPropagation = true;
     break;

     case 400:
     case 409:
       handleKnownErrors(response, deferred);
       stopErrorPropagation = false;
     break;

     default:
       handleUnknownErrors(response, deferred);
       stopErrorPropagation = false;
     break;
   }

   return !stopErrorPropagation;
  });

  /**
   * This is called when a 401 unauthorized response
   * is returned from API. This will mimic a ui-router
   * state change event, which will then call user.logout()
   * @param  {object} response  Raw response from the server.
   * @param  {Promise} deferred
   */
  function handleUnauthorized(response, deferred) {
    var error;

    //console.log('handleUnauthorized', response);

    // deferred.reject();

    // create a custom ui-router error for 401 unauthorized
    error = { type: ERROR.unauthorizedRequest };

    // manually trigger ui-router state change event passing in custom error
    $rootScope.$broadcast('$stateChangeError', null, null, null, null, error);
  }

  /**
   * If an expired access token error is triggered this
   * will catch it and request a new access token using
   * the user's current refresh token. It will then repeat
   * the original call that triggered the 403 error.
   *
   * see https://github.com/mgonto/restangular#seterrorinterceptor
   */
  function handleExpiredToken(response, deferred) {
    var restangularizedResponse;

    console.log('handleExpiredToken', response);

    auth.authRefresh().then(function() {
      // update the headers with the new access token
      // we have to do this because we're using $http restangular request interceptors won't be called
      response.config.headers['Authorization'] = 'Bearer ' + authStore.getAccessToken();

      // Repeat the request and then call the handlers the usual way.
      $http(response.config)
        .then(function(httpResponse) {
          restangularizedResponse = Restangular.restangularizeElement(null, httpResponse.data, 'expiredToken');
          deferred.resolve(restangularizedResponse);
        })
        .catch(deferred.reject);
    });
  }

  function handleKnownErrors(response, deferred) {
    console.log('handleKnownErrors', response);
    deferred.reject(response.data.error);
  }

  function handleUnknownErrors(response, deferred) {
    console.log('handleUnknownErrors', response);
  }

}

module.exports = ['$rootScope', '$http', 'Restangular', 'auth', 'authStore', 'ERROR', RestangularRun];
