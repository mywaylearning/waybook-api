/**
 * Exploration Record Model
 *
 * Used to store computed results from explorations
 */

'use strict';

var reject = require('../helpers/reject');
var watson = require('../../lib/watson');

var create = function(data, callback, ExplorationRecord) {
    return ExplorationRecord.create(data, callback);
};

/**
 * Since exploration already contains records object, we can  use first object
 * from array and get `answer`, since it's only one answer for Watson
 * exploration, use the first record
 */
var callWatson = function(exploration, userId, ExplorationRecord, callback) {
    if (!exploration.records) {
        return callback({
            error: 'no records found'
        });
    }

    watson(exploration.records[0].answer, function(error, profile) {
        if (error) {
            /**
             * TODO: Return proper error
             */
            return callback(error);
        }

        var model = {
            userId: userId,
            explorationId: exploration.id,
            result: profile,
            createdAt: new Date()
        };

        console.log('about to create a record with follworing profile', profile);
        ExplorationRecord.createRecord(model, function(error, data) {
            console.log('after create record', error, data);
        });
        return callback(null, profile);
    });
};

module.exports = function(ExplorationRecord) {

    ExplorationRecord.createRecord = function(data, callback) {
        callback = callback || function() {};
        return create(data, callback, ExplorationRecord);
    };

    /**
     * Exploration MUST CONTAINS userId field
     */
    ExplorationRecord.getResults = function(exploration, userId, callback) {

        var query = {
            where: {
                userId: userId,
                explorationId: exploration.id
            }
        };

        return ExplorationRecord.findOne(query, function(error, data) {
            if (error) {
                return callback(error);
            }

            if (data) {
                return callback(null, data);
            }

            if (exploration.slug === 'personality-watson') {
                return callWatson(exploration, userId, ExplorationRecord, callback);
            }

            return reject('not found', callback);
        });
    };
};
