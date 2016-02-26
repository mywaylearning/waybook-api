/**
 * Used to generate migrations for guideme section
 */
'use strict';

require('dotenv').load();

let async = require('async');
let server = require('../server/server.js');
let toml = require('../lib/loadToml');
let GUIDEME = 'guideme';
let Task = server.models.Task;

function tomlLoaded(content, callback) {

    let query = {
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

toml(GUIDEME + '/guideme.toml', function(error, content) {
    if (error) {
        console.log('error parsing guideme.toml file');
        return process.exit(1);
    }

    let series = content.tasks.map(function(task) {
        task.tags = task.tags.split(',');

        return function(callback) {
            tomlLoaded(task, callback);
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
