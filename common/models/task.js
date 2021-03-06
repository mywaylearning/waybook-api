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

    var Exploration = this.app.models.Exploration;

    function after(error, data) {
        if (error) {
            return reject('error on loading task', callback);
        }

        if (!data) {
            return notFound(callback);
        }

        if (!task.explorationId) {
            return data.updateAttributes(task, callback);
        }

        return Exploration.findById(task.explorationId, function(error, exploration) {
            task.objectId = exploration.id;
            task.modelName = 'Exploration';
            task.path = exploration.slug;

            return data.updateAttributes(task, callback);
        });
    }

    return this.findById(id, after);
}

function index(request, callback) {
    var currentUser = request.user;

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

        task.explorationId = task.objectId;
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

    if (!task.explorationId) {
        return this.create(task, callback);
    }

    var Exploration = request.app.models.Exploration;

    return Exploration.findById(task.explorationId, function(error, exploration) {
        task.section = 'explore';
        task.objectId = task.explorationId;
        task.modelName = 'Exploration';
        task.path = exploration.slug;

        return this.create(task, callback);
    }.bind(this));
}

module.exports = function(Task) {

    Task.updateTask = updateTask.bind(Task);
    Task.index = index.bind(Task);
    Task.createTask = createTask.bind(Task);
    Task.getTask = show.bind(Task);
};
