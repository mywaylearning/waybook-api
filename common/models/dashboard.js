/**
 * Based on current user id, query data associated
 */

'use strict';

var async = require('async');
var mapResults = require('../helpers/mapDashboardResults');

/**
 * For each userId, return supporters, goals and discoveries count query.
 * We just build an object to execute a query to database in parallel
 *
 * TODO: Extract this to a helper and provide test for it.
 */
function setQuery(userIds, Model) {
    var Contact = Model.app.models.Contact;
    var Post = Model.app.models.Post;
    var Record = Model.app.models.Record;
    var parallel = {};

    userIds.map(function(userId) {
        parallel['supporters-' + userId] = function(after) {
            return Contact.count({
                userId: userId
            }, after);
        };

        parallel['discoveries-' + userId] = function(after) {
            return Post.count({
                userId: userId,
                postType: 'discovery'
            }, after);
        };

        parallel['goals-' + userId] = function(after) {
            return Post.count({
                userId: userId,
                postType: 'goal'
            }, after);
        };

        parallel['questionsCompleted-' + userId] = function(after) {
            return Record.count({
                userId: userId,
            }, after);
        };
    });

    return parallel;
}

module.exports = function(Model, userIds, callback) {
    var Question = Model.app.models.Question;
    var parallel = setQuery(userIds, Model);

    /**
     * Since we just need total of questions once, we do not query for each user
     */
    parallel.questions = function(after) {
        return Question.count({}, after);
    };

    return async.parallel(parallel, function(error, data) {
        if (error) {
            return callback(error);
        }

        return callback(null, mapResults(data, userIds));
    });
};
