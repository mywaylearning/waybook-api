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
// 8990 78 59 Jovany

    var Task = this.app.models.Task;
    var TaskRecords = this.app.models.TaskRecords;

    Task.find({}, function(error, tasks) {
        if (error) {
            return reject('Cant load tasks', callback);
        }

        return TaskRecords.find(query, function(error, records) {
            if (error) {
                return reject('Cant load tasks', callback);
            }

            var store = fromArray(records, 'title');
            var data = completed(tasks, store);
            var filtered = filter(data, ['title', 'skip', 'completed']);

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
