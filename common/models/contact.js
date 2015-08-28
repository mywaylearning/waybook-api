'use strict';

var reject = require('../helpers/reject');
var load = require('../helpers/load');
var async = require('async');

module.exports = function(Contact) {

    Contact.createContact = function(contact, request, callback) {
        var currentUser = request.user;
        contact.userId = currentUser.id;
        return Contact.create(contact, callback);
    };

    /**
     * Due this error:
     * Error: ER_PARSE_ERROR: You have an error in your SQL syntax; check the
     * manual that corresponds to your MySQL server version for the right syntax
     * to use near 'WHERE `email`=...' at line 1
     * we need to update each contact manually
     */
    Contact.updateWaybookIds = function(userId, userEmail, callback) {
        var query = {
            where: {
                email: userEmail
            }
        };

        Contact.find(query, function(error, contacts) {
            if (error) {
                return callback(error, null);
            }

            var ids = contacts.map(function(contact) {
                contact.waybookId = userId;
                Contact.upsert(contact);
                return contact.id;
            });

            /**
             * Contact updated needed since we need to look for all post shared
             * with a contact's id, and set `sharedWith` = userId
             */
            return callback(null, ids);
        });
    };

    /**
     * Creates contacts based on an array of objects like:
     *  { email: 'x', userId: 'y' }
     * @see https://github.com/strongloop/loopback/issues/1275
     */
    Contact.bulkCreate = function(array, callback) {

        var parallel = array.map(function(item) {

            return function(after) {

                var query = {
                    where: {
                        email: item.email,
                        userId: item.userId
                    }
                };
                return Contact.findOrCreate(query, item, after);
            };
        });

        return async.parallel(parallel, callback);
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

    Contact.getContact = function(id, request, callback) {
        var currentUser = request.user;

        if (!currentUser || !currentUser.id) {
            return reject('authenticated user is required', callback);
        }

        var after = function(contact) {
            if (contact.userId !== currentUser.id) {
                return reject('not authorized', callback);
            }

            return callback(null, contact);
        };

        return load.call(Contact, id, callback, after);
    };

    Contact.put = function(id, data, request, callback) {
        if (!id || !data) {
            return reject('params required', callback);
        }

        var currentUser = request.user;

        if (!currentUser || !currentUser.id) {
            return reject('user requiered', callback);
        }

        data.id = id;
        data.userId = currentUser.id;

        var after = function(contact) {
            if (contact.userId !== currentUser.id) {
                return reject('Not authorized', callback);
            }

            return Contact.upsert(data, callback);
        };

        return load.call(Contact, id, callback, after);
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
