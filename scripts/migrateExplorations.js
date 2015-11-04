'use strict';

var dotenv = require('dotenv');
dotenv.load();

var fs = require('fs');
var async = require('async');
var server = require('../server/server.js');
var toml = require('../lib/loadToml');
// var validate = require('../lib/validateToml');

var EXPLORATIONS = 'explorations';
var Category = server.models.Category;
var Question = server.models.Question;
var Answer = server.models.Answer;
var Exploration = server.models.Exploration;

/**
 * From exploration created, get question objects to be ready to insert to db
 */
function questionObjects(content, exploration) {
    return Object.keys(content.questions).map(function(order) {
        return {
            question: content.questions[order],
            explorationId: exploration.id,
            order: order
        };
    });
}

/**
 * From exploration created, build answer objects to be ready to insert to db
 */
function answerObjects(content, exploration) {
    return Object.keys(content.answers).map(function(order) {
        return {
            answer: content.answers[order],
            explorationId: +exploration.id,
            order: order
        };
    });
}

function tomlLoaded(content, callback) {
    /**
     * Disable validation of schema due an issue on boolean values
     * @see https://github.com/Nijikokun/Validator/issues/8
     */
    /*
    var result = validate(content);

    if (result._error) {
        console.log(result);
        return callback(result);
    }
    */

    var categoryQuery = {
        where: {
            category: content.meta.category
        }
    };

    var model = {
        category: content.meta.category
    };

    function updateQuestions(exploration) {
        exploration.toJSON().questions.map(function(question) {
            if (question.question === content.questions[question.order]) {
                return;
            }

            question.question = content.questions[question.order];

            Question.upsert(question, function(error, questionUpdated) {
                console.log('on update question', error, questionUpdated);
            });
        });
    }

    function updateAnswers(exploration) {
        exploration.toJSON().answers.map(function(answer) {
            if (answer.answer === content.answers[answer.order]) {
                return;
            }

            answer.answer = content.answers[answer.order];

            Answer.upsert(answer, function(error, answerUpdated) {
                console.log('on update answer', error, answerUpdated);
            });
        });
    }

    function upsertExploration(exploration, content, category) {
        content.meta.categoryId = category.id;
        content.meta.id = exploration.id;

        updateQuestions(exploration);
        updateAnswers(exploration);

        /**
         * We just care about update exploration in order to keep flow,
         * update answers|questions will go async
         */
        return Exploration.upsert(content.meta, function(error, updated) {
            if (error) {
                return callback(error);
            }
            console.log('\nExploration updated', updated.name);
            return callback(null, updated);
        });
    }

    function aftercreateQuestion(error, results, answers) {
        if (error) {
            console.log(error);
            return callback(error);
        }

        console.log('\tquestions created', results.length);

        Answer.create(answers, function(error, data) {
            if (error) {
                console.log(error);
                return callback(error);
            }
            console.log('\tanswers created', data.length);

            return callback(null, data.explorationId);
        });
    }

    function afterCreateExploration(error, exploration) {

        if (error) {
            console.log('error on create exploration', error, content.meta);
            return callback(error);
        }

        console.log('\n\n\tExploration created', exploration.id);

        var questions = questionObjects(content, exploration);
        var answers = answerObjects(content, exploration);

        Question.create(questions, function(error, results) {
            return aftercreateQuestion(error, results, answers);
        });
    }

    function afterFindExploration(error, exploration, category, content) {
        if (error) {
            console.log(error);
            return callback(error);
        }
        content.meta.categoryId = category.id;

        /**
         * Create exploration if not found based on query using content.meta.name
         */
        if (!exploration) {
            return Exploration.create(content.meta, afterCreateExploration);
        }

        /**
         * Check if version from content(parsed toml file) and exploration(db
         * record) matches
         */
        if (exploration && content.meta.version === exploration.version) {
            console.log('\nNothing to do, ', exploration.name, 'already exists');
            return callback(null, exploration);
        }


        var version = exploration ? exploration.version.split('.') : null;
        var current = content.meta.version.split('.');

        if (version[1] !== current[1] || version[2] !== current[2]) {
            return upsertExploration(exploration, content, category);
        }

        /**
         * If we get to this point, means we are going to release a new version
         * of the exploration, wich means, create a new one.
         */
        return Exploration.create(content.meta, afterCreateExploration);
    }

    function afterCategories(error, category) {
        if (error) {
            console.log('error on create category', error);
            return callback(error);
        }

        /**
         * Query based on name, that's the only content not allowed to change
         * defined as key for each exploration
         */
        var query = {
            where: {
                name: content.meta.name,
            },
            include: ['questions', 'answers']
        };

        Exploration.findOne(query, function(error, exploration) {
            // console.log(exploration.toJSON().questions.length, '\n')
            return afterFindExploration(error, exploration, category, content);
        });
    }

    Category.findOrCreate(categoryQuery, model, afterCategories);
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
