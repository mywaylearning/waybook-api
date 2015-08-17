'use strict';

var reject = require('../helpers/reject');

module.exports = function(Contact) {

    Contact.createContact = function(contact, request, callback) {
        var currentUser = request.user;
        contact.userId = currentUser.id;
        return Contact.create(contact, callback);
    };

    Contact.contactsIndex = function(request, callback) {
        var currentUser = request.user;

        if(!currentUser || !currentUser.id){
            return reject('authenticated user is required', callback);
        }

        var query = {
            where: {
                userId: currentUser.id
            }
        };

        return Contact.all(query, callback);
    };
};
