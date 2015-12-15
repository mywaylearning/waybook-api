'use strict';
var async = require('async');

function mapResults(data, userIds) {
    var response = {};

    userIds.map(function(userId) {
        response[userId] = {
            supporters: data['supporters-' + userId],
            discoveries: data['discoveries-' + userId],
            goals: data['goals-' + userId],
        };
    });

    return response;
}

module.exports = function(Model, userIds, callback) {
    var Contact = Model.app.models.Contact;
    var Post = Model.app.models.Post;

    var parallel = {};

    /**
     * For each userId, return supporters, goals and discoveries count query.
     * We just build an object to execute a query to database in parallel
     *
     * TODO: Extract this to a helper and provide test for it.
     */
    function setQuery(userId) {
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
    }

    userIds.map(function(userId) {
        setQuery(userId);
    });

    return async.parallel(parallel, function(error, data) {
        if (error) {
            return callback(error);
        }

        return callback(null, mapResults(data, userIds));
    });
};
