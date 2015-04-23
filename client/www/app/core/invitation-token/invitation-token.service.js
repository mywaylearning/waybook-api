(function() {

  'use strict';

  function InvitationTokenService($location, router, invitationStore, user, $rootScope) {
    var service,
      token;

    service = {
      checkToken: _checkToken,
      setToken: _setToken,
      getToken: _getToken,
      getInvitation: _getInvitation,
      destroyInvitation: destroyAll
    };



    /**
     *
     * @returns {*}
     * @private
     */
    function _checkToken() {

      $rootScope.notifications = undefined;

      var urlToken = $location.search().token;
      token = _getToken();

      if (token || urlToken) {

        if (urlToken) {
          _setToken(urlToken);
        }



      } else {
        return false;
      }
    }


    function onExistToken(data) {

      var invitation = data.plain().invitation;

      invitationStore.save(data.plain(), { getData: true });

      //for logged users
      var cUser = user.currentUser().$object;


      if (cUser) {
        if (cUser.email === invitation.receiverEmail.toLowerCase()) {

          console.log('isAutenticated');
          var tToken = _getToken();

          partner.acceptInvitation(tToken.toString(), cUser.username)
            .then(onAcceptInvitation)
            .catch(onErrorInvitation);

        } else {

          console.log('no User match');
          destroyAll();

        }
      } else {
        //for nologged users
        if (invitation.isNewUser) {
          //for new user go to login
          router.goTo('public.forms.register');

          console.log('new user');

        } else {
          //for existing user go to register
          router.goTo('public.forms.login');

          console.log('exsiting user');

        }
      }
    }

    /**
     * on Success invitation accepted
     * @param {Object} data
     */
      function onAcceptInvitation(data) {
        $rootScope.notifications = {
          text: 'You have been granted access to a new shared product group.',
          type: 'success'
        };
        console.log('invited flow completed', data);
        destroyAll();
      }

    /**
     * err Handler on invitation
     * @param {Error} err
     */
      function onErrorInvitation(err) {
      $rootScope.notifications = {
        text: 'Ops something go wrong, please try again. ' + err.data.error.message,
        type: 'err'
      };
        console.log('err acepting invitation', err);
        destroyAll();
    }

    /**
     * Delete all
     * @param {Error} err
     */
      function onErrToken(err) {
        console.log('no User match', err);
        destroyAll();
      }

    function destroyAll() {
      invitationStore.destroy();
      invitationStore.destroy({data: true});
      router.clearParam('token');
    }

    function _getInvitation() {
      return invitationStore.get({data: true});
    }
      /**
       * Set Token
       * @param {String} newToken
       * @private
       */

      function _setToken(newToken) {
        token = newToken;
        invitationStore.save(token);
      }


      function _getToken() {
        if (token) { return token; }
        return invitationStore.get();
      }

      return service;
    }


  module.exports = ['$location', 'router', 'invitationStore', 'user', '$rootScope', InvitationTokenService];

}());
