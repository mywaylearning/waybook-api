'use strict';
var isArray = require('lodash.isarray');
var isFunction = require('lodash.isfunction');

var sendgrid = require('sendgrid')(process.env.WAYBOOK_SENDGRID_KEY);

var addSubstitutions = function(data, email) {
  Object.keys(data.substitutions).map(function(key) {
    email.addSubstitution(key, data.substitutions[key]);
  });
};

/**
 * Send email with provided data
 *
 * data.to: [], an array of emails
 * data.subject: '', string, can be combined with template default value
 * data.templateId: '', unique id from sendgrid template id, using env variables
 * data.html, html used for <%body%> tag on sendgrid template
 * data.text, text based content for non html clients(old devices)
 * callback
 */
module.exports = function(data, callback) {

  if (!isFunction(callback)) {
    callback = function() {};
  }

  if (!data.to) {
    return callback({
      error: 'param to is required'
    });
  }

  if (!data.templateId) {
    return callback({
      error: 'param data.templateId is required'
    });
  }

  if (!isArray(data.to)) {
    return callback({
      error: 'param data.to must be an array'
    });
  }

  var email = new sendgrid.Email({
    from: 'way@me.com',
    subject: data.subject,
    text: data.text,
    html: data.html
  });

  if (data.substitutions) {
    addSubstitutions(data, email);
  }

  data.to.map(function(to) {
    email.addTo(to);
  });

  email.addFilter('templates', 'enable', 1);
  email.addFilter('templates', 'template_id', data.templateId);

  sendgrid.send(email, callback);
};
