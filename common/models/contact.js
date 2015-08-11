'use strict';

module.exports = function(Contact) {

  Contact.createContact = function(contact, request, callback) {
    return Contact.create(contact, callback);
  };

  Contact.contactsIndex = function(userId, request, callback) {

    if (!userId) {
      return callback({
        error: 'userId param required'
      });
    }

    var query = {
      where: {
        userId: userId
      }
    };

    return Contact.all(query, callback);
  }
};
