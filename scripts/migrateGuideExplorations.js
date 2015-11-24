'use strict';

var dotenv = require('dotenv');
dotenv.load();

var async = require('async');
var server = require('../server/server.js');
var Task = server.models.Task;
var Exploration = server.models.Exploration;

function task(content, callback) {

    var query = {
        where: {
            title: content.title
        }
    };

    function afterFindOrCreate(error, task) {
        console.log('afterFindOrCreate', error, task);
        if (error) {
            return callback(error);
        }
        return callback(null, task);
    }

    Task.findOrCreate(query, content, afterFindOrCreate);
}

var query = {
    fields: ['name', 'slug']
};

Exploration.find(query, function(error, explorations) {
    if (error) {
        console.log('error on fetch explorations', error);
        return process.exit(1);
    }

    var series = explorations.map(function(exploration) {
        return function(callback) {
            task({
                title: exploration.name,
                path: exploration.slug,
                section: 'explore',
                disabled: true
            }, callback);
        };
    });

    async.series(series, function(error) {
        if (error) {
            console.log(error);
            return process.exit(1);
        }
        return process.exit(0);
    });
});
