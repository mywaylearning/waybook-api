'use strict';

/**
 * Set default config for all Restangular instances.
 * @param {provider} RestangularProvider
 * @param {constant} AUTH_URL The proxy domain is used for authenticate calls.
 */
function RestangularConfig(RestangularProvider, AUTH_URL) {
  /**
   *  Set default base url
   */
  RestangularProvider.setBaseUrl(AUTH_URL);

  /**
   *  Set default request headers
   */
  RestangularProvider.setDefaultHeaders({
    'Content-Type': 'application/json'
  });

  /**
   * Add custom elements to the user model.
   * fullname - firstName + lastName
   * initials - 1st char firstName + 1st char lastName
   * imageCSS - helper property that gives ng-style object
   *            for user image already in background-image.
   */
  RestangularProvider.extendModel('user', function(element) {
    // firstName / lastName
    if (element.firstName && element.lastName) {
      element.fullname = element.firstName + ' ' + element.lastName;
      element.initials = element.firstName.charAt(0) + element.lastName.charAt(0);
    }

    // image
    if (element.image) {
      element.imageCSS = { backgroundImage: 'url("' + element.image + '")' };
    }

    return element;
  });
}

module.exports = ['RestangularProvider', 'AUTH_URL', RestangularConfig];
