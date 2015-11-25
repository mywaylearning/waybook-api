'use strict';
var reject = require('../helpers/reject');
var isAdmin = require('../helpers/isAdmin');
var notAuthorized = require('../helpers/notAuthorized');
var notFound = require('../helpers/notFound');

module.exports = function(Task) {

    Task.updateTask = function(id, task, request, callback) {
        var currentUser = request.user;

        if (!id) {
            return reject('ID param required', callback);
        }

        if (!currentUser || !currentUser.id) {
            return reject('authenticated admin user is required', callback);
        }

        if (!isAdmin(currentUser)) {
            return notAuthorized(callback);
        }

        function after(error, data) {
            if (error) {
                return reject('error on loading task', callback);
            }

            if (!data) {
                return notFound(callback);
            }

            return data.updateAttributes(task, callback);
        }

        return Task.findById(id, after);
    };

    Task.index = function(request, callback) {
        return Task.find({}, callback);
    }
};
