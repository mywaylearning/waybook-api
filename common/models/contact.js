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
     * @see https://github.com/strongloop/loopback/issues/1275
     */
    Contact.bulkCreate = function(array, callback) {

        var parallel = array.map(function(item){
            return function(callback){
                Contact.create(item, callback);
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
