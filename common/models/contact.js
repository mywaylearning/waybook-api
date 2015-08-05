'use strict';

module.exports = function(Contact) {

  Contact.createContact = function(contact, request, callback) {
    return Contact.create(contact, callback);
  };
};
