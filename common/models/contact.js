'use strict';

var reject = require('../helpers/reject');
var load = require('../helpers/load');

module.exports = function(Contact) {

    Contact.createContact = function(contact, request, callback) {
        var currentUser = request.user;
        contact.userId = currentUser.id;
        return Contact.create(contact, callback);
    };

    Contact.contactsIndex = function(request, callback) {
        var currentUser = request.user;

        if (!currentUser || !currentUser.id) {
            return reject('authenticated user is required', callback);
        }

        var query = {
            where: {
                userId: currentUser.id
            },

            /**
             * https://docs.strongloop.com/display/public/LB/Querying+data
             */
            fields: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
            }
        };

        return Contact.all(query, callback);
    };

    Contact.deleteContact = function(id, request, callback) {
        var currentUser = request.user;
        if (!currentUser || !currentUser.id) {
            return reject('authenticated user is required', callback);
        }

        var after = function(contact) {
            if (contact.userId !== currentUser.id) {
                return reject('not authorized', callback);
            }

            return Contact.destroyById(id, callback);
        };

        return load.call(Contact, id, callback, after);
    };
};
