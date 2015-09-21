'use strict';

var dotenv = require('dotenv');
dotenv.load();

var fs = require('fs');
var async = require('async');
var server = require('../server/server.js');
var toml = require('../lib/loadToml');
var validate = require('../lib/validateToml');

var EXPLORATIONS = 'explorations';
var Category = server.models.Category;
var Question = server.models.Question;
var Answer = server.models.Answer;
var Exploration = server.models.Exploration;


function tomlLoaded(content, callback) {

    var result = validate(content);

    if (result._error) {
        console.log(result);
        return callback(result);
    }

    var categoryQuery = {
        where: {
            category: content.meta.category
        }
    };

    var model = {
        category: content.meta.category
    };

    Category.findOrCreate(categoryQuery, model, function(error, category) {
        if(error){
            console.log('error on create category', error);
            return callback(error);
        }

        var query = {
            where: {
                name: content.meta.name,
                version: content.meta.version
            }
        };

        Exploration.findOne(query, function(error, exploration) {
            if (error) {
                console.log(error);
                return callback(error);
            }

            if (exploration) {
                console.log('\tExploration "' + exploration.name + '" already exists');
                return callback(null, exploration);
            }

            content.meta.categoryId = category.id;

            Exploration.create(content.meta, function(error, exploration) {

                if (error) {
                    console.log('error on create exploration', error, content.meta);
                    return callback(error);
                }

                console.log('\n\nexploration created', exploration.id);
                var questions = Object.keys(content.questions).map(function(order) {
                    return {
                        question: content.questions[order],
                        explorationId: exploration.id,
                        order: order
                    };
                });

                var answers = Object.keys(content.answers).map(function(order) {
                    return {
                        answer: content.answers[order],
                        explorationId: +exploration.id,
                        order: order
                    };
                });

                Question.create(questions, function(error, results) {
                    if (error) {
                        console.log(error);
                        return callback(error);
                    }

                    console.log('questions created', results.length);

                    Answer.create(answers, function(error, data) {
                        if (error) {
                            console.log(error);
                            return callback(error);
                        }
                        console.log('answers created', data.length);

                        return callback(null, exploration);
                    });
                });
            });

        });
    });
}

fs.readdir(EXPLORATIONS, function(error, list) {
    if (error) {
        return console.log(error);
    }

    var series = list.map(function(file) {
        return function(callback) {
            toml(EXPLORATIONS + '/' + file, function(error, content) {
                if (error) {
                    console.log('error parsing', file);
                    return callback(error);
                }
                return tomlLoaded(content, callback);
            });
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

