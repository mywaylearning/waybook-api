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

        var WaybookUser = Contact.app.models.WaybookUser;
        var parallel = array.map(function(item) {

            return function(after) {

                var query = {
                    where: {
                        email: item.email,
                        userId: item.userId
                    }
                };

                /**
                 * We need to find a waybook user with contact's email,
                 * if there's an user, associate it with contact. Then, post will
                 * be shared using `sharedWith` instead of `withContact`
                 */
                return WaybookUser.find({
                    where: {
                        email: item.email
                    }
                }, function(error, user) {

                    if (error) {
                        console.log(error);
                    }

                    if (!user.length || !user[0] || !user[0].id) {
                        /**
                         * On this scenario, after an user creates an account with
                         * contact's email and VERIFIED that account, Contact table
                         * will be updated and Share options too
                         */
                        return Contact.findOrCreate(query, item, after);
                    }

                    item.waybookId = user[0].id;
                    return Contact.findOrCreate(query, item, after);
                });

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
                waybookId: true,
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
