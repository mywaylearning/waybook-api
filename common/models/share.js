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
        console.log('ids', ids);
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

                console.log('about to upsert share', share.id);
                Share.upsert(share);
                return share.id;
            });
            return callback(null, ids);
        });
    };
};
