'use strict';

var reject = require('../helpers/reject');
var fromArray = require('../helpers/fromArray');
var filter = require('../helpers/filterObjectFields');
var completed = require('../helpers/completedTasks');

/**
 * Get list of tasks associated to current user
 */
var guideIndex = function(request, callback) {
    var currentUser = request.user;
    var query = {
        where: {
            userId: currentUser.id
        }
    };

    var Task = this.app.models.Task;
    var TaskRecords = this.app.models.TaskRecords;

    Task.find({
        disabled: false
    }, function(error, tasks) {
        if (error) {
            console.log('error on load tasks', error);
            return reject('Cant load tasks', callback);
        }

        return TaskRecords.find(query, function(error, records) {
            if (error) {
                return reject('Cant load tasks', callback);
            }
            var store = fromArray(records, 'title', 'completed', 'order', 'path');
            var data = completed(tasks, store);

            var filtered = filter(data, [
                'title', 'skip', 'completed', 'path', 'tags', 'section',
                'disabled', 'order', 'patch'
            ]).filter(function(item) {
                return !item.disabled;
            });

            return callback(null, filtered);
        });
    });

};

var saveRecord = function(record, request, callback) {
    var query = {
        where: {

        }
    };
    return this.find(query, callback);
};

/**
 * Export public methods for TaskRecords model
 */
module.exports = function(TaskRecords) {

    TaskRecords.index = guideIndex.bind(TaskRecords);
    TaskRecords.saveRecord = saveRecord.bind(TaskRecords);
};
