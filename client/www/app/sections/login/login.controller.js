(function() {

  'use strict';

  var debug = require('debug')('waybook:LoginController');

  function LoginController($scope, router, auth, user, errorHandler) {
    // var scope = this,
    //     errors;

    //errors = errorHandler.getInstance(scope);

    $scope.loginData = {};

    // if (invitation) {
    //   scope.invitation = invitation.invitation;
    //   scope.receiverEmail = scope.invitation.receiverEmail;
    //   debug(invitation);
    // }

    /**
     * Handle login form submission and validation.
     * Once the use has successfully authenticated
     * they will be redirected to appropriate page.
     * @param  {controller} form Angular Formcontroller
     */
    $scope.doLogin = function() {
      debug('in doLogin');
      //errors.reset();
      //errors.setFormController(form);

      //if (!form.$valid) { return false; }

      //fieldset.disable(loginForm);

      auth.authenticate($scope.loginData.email.toLowerCase(), $scope.loginData.password)
        .then(onAuthenticated)
        .then(onGetUserSuccess)
        .catch(handleError);
    };

    /**
     * On successful user authentication
     * make a call to get user object.
     * @return {Promise}
     */
    function onAuthenticated() {
      return user.getSelf();
    }

    /**
     * Once the user object has been received
     * upate the AppController user object.
     * Then redirect to logged in state.
     * @param  {Object} userData
     */
    function onGetUserSuccess(userData) {
      // update app controller user instance
      $scope.app.user = userData;

      router.goToLoggedIn();
    }

    function handleError(err) {
      //errors.handle(err);

      //fieldset.enable(loginForm);
    }
  }

  module.exports = ['$scope', 'router', 'auth', 'user', 'errorHandler', LoginController];

}());
