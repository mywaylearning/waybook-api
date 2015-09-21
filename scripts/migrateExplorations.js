'use strict';

var dotenv = require('dotenv');
dotenv.load();

var fs = require('fs');
var server = require('../server/server.js');
var toml = require('../lib/loadToml');
var validate = require('../lib/validateToml');

var EXPLORATIONS = 'explorations';
var Category = server.models.Category;
var Question = server.models.Question;
var Answer = server.models.Answer;
var Exploration = server.models.Exploration;

function findOrCreateCategory(category, callback) {
    var query = {
        where: {
            category: category
        }
    };

    var model = {
        category: category
    };

    Category.findOrCreate(query, model, function(error, record) {
        if (error) {
            console.log(error);
            return process.exit(1);
        }
        return callback(record);
    });
}

function tomlLoaded(error, content, last) {
    if (error) {
        console.log(error);
        return process.exit(1);
    }

    var result = validate(content);

    if (result._error) {
        console.log(result);
        return process.exit(1);
    }

    findOrCreateCategory(content.meta.category, function(category) {
        var query = {
            where: {
                name: content.meta.name,
                version: content.meta.version
            }
        };

        Exploration.findOne(query, function(error, exploration) {
            if (error) {
                console.log(error);
                return process.exit(1);
            }

            if (exploration) {
                console.log('\tExploration "' + exploration.name + '" already exists');
                if (last) {
                    return process.exit(0);
                }
            }

            content.meta.categoryId = category.id;

            Exploration.create(content.meta, function(error, exploration) {

                if (error) {
                    console.log('error on create exploration', error, content.meta);
                    return process.exit(1);
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
                        return process.exit(1);
                    }

                    console.log('questions created', results.length);

                    Answer.create(answers, function(error, data) {
                        if (error) {
                            console.log(error);
                            return process.exit(1);
                        }
                        console.log('answers created', data.length);
                        process.exit(0);
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

    list.map(function(file, index) {
        console.log('about to parse', file);
        return toml(EXPLORATIONS + '/' + file, function(error, content) {
            return tomlLoaded(error, content, index === list.length - 1);
        });
    });
});
