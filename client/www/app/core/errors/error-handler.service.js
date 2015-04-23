'use strict';

/**
 * This a factory service that has a single
 * getInstance method that will return a new
 * instance of the ErrorHandler class.
 *
 * The ErrorHandler class is for handling errors
 * that occur during form submissions. It works
 * with Angular's ng-message directive.
 *
  Usage inside Angular controller:

  var errors = errors = errorHandler.getInstance(scope);

  user.register(userObj).catch(function(err) {
    errors.handle(err);
  });
 */
function ErrorHandlerFactory(FORM_ERRORS) {
  var factory,
      unknownError,
      errorToFieldMap;

  /**
   * default error object that will be used
   * if an error object is unrecoginized
   * @type {Object}
   */
  unknownError = {
    name: 'UnknownError'
  };

  /**
   * Certain errors map to a specific form field.
   * This collection of key value pairs maps
   * error codes to form input names.
   * If input names is an array it will loop through
   * all fields values.
   *
   * @type {Object}
   */
  errorToFieldMap = {};
  errorToFieldMap[FORM_ERRORS.invalidLogin] = ['email', 'password'];
  errorToFieldMap[FORM_ERRORS.userEmailTaken] = 'email';

  /**
   * Public
   */
  factory = {
    getInstance: _getInstance
  };

  /**
   * Private
   */

  /**
   * Return a new instance of ErrorHandler
   * @param  {Object} scope The scope object the errors will be applied to.
   * @return {ErrorHandler}
   */
  function _getInstance(scope) {
    return new ErrorHandler(scope);
  }

  function isKnownError(error) {
    var errorMatch = false;

    if (!error.name) { return errorMatch; }

    angular.forEach(FORM_ERRORS, function(value) {
      if (error.name === value) { errorMatch = true; }
    });

    return errorMatch;
  }

  /**
   * ErrorHandler Class
   * When a new instance of the error handler class is created
   * it is passed a reference to a controller's scope. A new
   * errors property is then added to the scope object. This will
   * be populated with the error messaging needed to display the
   * error in the form.
   *
    Example error object:

    this.scope.errors = {
      OauthError: 'Invalid user credentials.',
    };

    HTML:

    <div ng-messages="controller.errors">
      <label ng-message="OauthError">{{controller.errors.OauthError}}</label>
    </div>
   *
   * @param {scope} scope The scope object the errors will be applied to.
   */
  function ErrorHandler(scope) {
    this.scope = scope;
    this.scope.errors = {};
  }

  /**
   * When passed an error object from the server
   * where the error object contains a valid name
   * and messages property - this method will add
   * the errors to the this.scope.errors property.
   *
   * If ErrorHandler has a valid form controller
   * that has been set using setFormController then
   * a check will be done to see if this error maps
   * to a particular field in the submiting form. If
   * the error does map to a field then that field's
   * form control will be set to invalid.
   *
    Usage to display error with form control:

    <div ng-messages="form.username.$error">
      <label ng-message="UsernameUnavailable">{{controller.errors.UsernameUnavailable}}</label>
    </div>

   * @param  {Object} err The error object returned from the server.
   * @param  {Boolean} resetBefore If true error handle will reset before handling error.
   */
  ErrorHandler.prototype.handle = function(err, resetBefore) {
    var errorName,
        errorMsg,
        fields,
        fieldName;

    if (resetBefore) { this.reset(); }

    // check if know error - if not default to unkown error
    errorName = isKnownError(err) ? err.name : unknownError.name;

    this.scope.errors[errorName] = true;

    // If this an unknown error no point doing field errors
    if (errorName === unknownError.name) { return false; }

    // Check for errors matching a specific form field
    fields = errorToFieldMap[errorName];

    if (this.form && fields) {
      // make sure fields is in array format even if there is only
      // one field matched
      fields = angular.isArray(fields) ? fields : [fields];

      fields.forEach(function(field) {

        if (this.form[field]) {
          // If the field exists in the form mark it as invalid
          this.form[field].$setValidity(errorName, false);
        }
      }, this);
    }
  };

  ErrorHandler.prototype.showAll = function() {
    angular.forEach(this.scope.errors, function(value, key) {
      this.handle({name: key});
    }, this);
  };

  /**
   * Add an instance of Angular's form controller.
   * This will be used to associate errors to specific
   * fields(controls) in your form.
   * @param {controller} formController An instance of Angular's FormController
   */
  ErrorHandler.prototype.setFormController = function(formController) {
    this.form = formController;
  };

  /**
   * Reset all errors for this ErrorHandler instance.
   */
  ErrorHandler.prototype.reset = function() {
    var errorName,
        fields,
        field;

    // is there a form controller with invalid fields
    if (this.form && this.form.$invalid) {
      // loop through the form controller errors
      for (errorName in this.form.$error) {
        // see if any of the errors map to known errors
        fields = errorToFieldMap[errorName];

        if (fields) {
          fields = angular.isArray(fields) ? fields : [fields];

          fields.forEach(function(field) {
            if (this.form[field]) {
              // mark all matched fields as valid
              this.form[field].$setValidity(errorName, true);
            }
          }, this);
        }
      }
    }

    // reset values
    this.scope.errors = {};
  };

  return factory;
}

module.exports = ['FORM_ERRORS', ErrorHandlerFactory];
