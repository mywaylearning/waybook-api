'use strict';
var reject = require('../helpers/reject');
var isAdmin = require('../helpers/isAdmin');
var notAuthorized = require('../helpers/notAuthorized');
var notFound = require('../helpers/notFound');

function updateTask(id, task, request, callback) {
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

    return this.findById(id, after);
}

function index(request, callback) {
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
    return this.find({}, callback);
}

var options = {
    unite: 'Contact',
    goal: 'Post',
    section: 'Exploration'
};

function show(id, request, callback) {
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

    return this.findById(id, function(error, task) {
        if (error) {
            return reject('error on loading task', callback);
        }
        if (!task) {
            return notFound(callback);
        }
        return callback(null, task);
    });
}

function createTask(task, request, callback) {

    if (!task.title || !task.section) {
        return reject('missing required params', callback);
    }

    var currentUser = request.user;

    if (!currentUser || !currentUser.id) {
        return reject('authenticated admin user is required', callback);
    }

    if (!isAdmin(currentUser)) {
        return notAuthorized(callback);
    }

    task.modelName = options[task.section];

    if (task.explorationId) {
        task.section = 'explore';
        task.objectId = task.explorationId;
        task.modelName = 'Exploration';
    }

    return this.create(task, callback);
}

module.exports = function(Task) {

    Task.updateTask = updateTask.bind(Task);
    Task.index = index.bind(Task);
    Task.createTask = createTask.bind(Task);
    Task.getTask = show.bind(Task);
};
