'use strict';

var async = require('async');
var shareParallel = require('../helpers/shareParallel');

module.exports = function(Share) {

    Share.withMany = function(data, callback) {
        var parallel = shareParallel(data, Share);

        async.parallel(parallel, callback || function(error, results) {
            console.log('after save all share', error, results);
        });
    };

    Share.updateShareWith = function(ids, userId, callback) {
        return Share.find({
            where: {
                withContact: {
                    inq: ids
                }
            }
        }, function(error, shares) {
            if (error) {
                return callback(error, null);
            }

            var ids =  shares.map(function(share) {
                share.sharedWith = userId;
                share.withContact = null;
                Share.upsert(share);

                return share.id;
            });
            return callback(null, ids);
        });
    };

    Share.deleteShared = function(id, userId, callback){
        callback = callback || function(error, id){
            console.log('shared record deleted', error, id);
        };

        var filter = {
            where: {
                postId: id,
                userId: userId
            }
        };

        Share.findOne(filter, function(error, shared){

            if(error){
                return callback(error);
            }

            if(!shared){
                return callback('not found');
            }

            return Share.destroyById(shared.id, callback);
        });
    };
};
