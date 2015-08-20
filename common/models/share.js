'use strict';

var async = require('async');
var shareParallel = require('../helpers/shareParallel');

module.exports = function(Share) {

    Share.withMany = function(data, callback){
        var parallel = shareParallel(data, Share);

        async.parallel(parallel, callback || function(error, results){
            console.log('after save all share', error, results);
        });
    };
};
