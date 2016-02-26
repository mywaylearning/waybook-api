'use strict';
var reject = require('../helpers/reject');
var fromArray = require('../helpers/fromArray');
var asq = require('../../algorithms/asq');
var big5 = require('../../algorithms/big5');
var matrix = require('../../algorithms/big5matrix');
var watson = require('../../lib/watson');
let shareResults = require('../lib/shareResults');
let heatmapResults = require('../lib/heatmapResults');

/**
 * Hardcoded values for asq algorithm, will be added to the toml file in the next
 * relesease of way product
 */
var agree = [
    2, 4, 5, 6, 7, 9, 12, 13, 16, 18, 19, 20, 21,
    22, 23, 26, 33, 35, 39, 41,
    42, 43, 45, 46
];

var disagree = [
    1, 3, 8, 10, 11, 14, 15, 17, 24, 25, 27, 28,
    29, 30, 31, 32, 34, 36, 37,
    38, 40, 44, 47, 48, 49, 50
];

var markAsCompleted = function(explorationId, request, Exploration) {
    var TaskRecord = Exploration.app.models.TaskRecords;
    var query = {
        where: {
            explorationId: explorationId,
            userId: request.user.id
        }
    };

    var model = {
        userId: request.user.id,
        explorationId: explorationId,
        title: explorationId,
        skip: false,
        completed: true,
        createdAt: new Date()
    };

    TaskRecord.findOrCreate(query, model, function() {});
};

var checkHeatmap = function(explorationId, request, Exploration) {
    var query = {
        where: {
            id: explorationId
        }
    };

    Exploration.findOne(query, function(error, exploration) {
        if (error) {
            return console.log(error);
        }

        if (!exploration) {
            return;
        }

        if (exploration.pattern === 'heatmap') {
            markAsCompleted(explorationId, request, Exploration);
        }
    });
};

module.exports = function(Exploration) {

    Exploration.put = function(id, data, request, callback) {
        if (!id || !data) {
            return reject('params required', callback);
        }

        var currentUser = request.user;

        if (!currentUser || !currentUser.id) {
            return reject('user required', callback);
        }

        if (request.body.shareResults && id) {
            request.query = request.query || {};
            request.query.explorationId = id;

            return getResults(request, function(error, data) {
                if (error) {
                    return callback(error);
                }

                let content = {
                    data: data,
                    user: request.user,
                    model: Exploration,
                    callback: callback
                };

                return shareResults(content);
            });
        }

        /**
         * Mark heatmap as completed
         */
        checkHeatmap(id, request, Exploration);

        data.id = null;
        data.explorationId = id;
        data.userId = currentUser.id;

        var query = {
            where: {
                userId: currentUser.id,
                question: data.question,
                explorationId: id,
            },
            order: ['createdAt DESC']
        };

        Exploration.findOne({
            where: {
                id: id
            }
        }, function(error, exploration) {
            if (error) {
                return callback(error);
            }

            if (!data) {
                return callback({
                    error: 'exploration not found'
                });
            }

            Exploration.app.models.Record.find(query, function(error, records) {
                if (error) {
                    console.log('on error on find record', error);
                    return callback(error);
                }

                /**
                 * If first record from records object matches data.answer, means it's
                 * the same record, otherwise, means user may return answer to a
                 * previous selected answer
                 */
                if (records && records.length && records[0].answer === data.answer) {
                    return callback(null, records[0]);
                }

                return Exploration.app.models.Record.create(data, function(error, data) {

                    if (exploration.algorithm === 'watson') {

                        var ExplorationRecord = Exploration.app.models.ExplorationRecord;

                        watson(data.answer, function(error, profile) {
                            if (error) {
                                /**
                                 * TODO: Return proper error
                                 */
                                return console.log('error on call watson', error);
                            }

                            var model = {
                                userId: currentUser.id,
                                explorationId: exploration.id,
                                result: profile,
                                createdAt: new Date()
                            };

                            ExplorationRecord.createRecord(model);
                        });

                    }

                    return callback(error, data);
                });
            });
        });
    };

    Exploration.indexExploration = function(request, callback) {
        var query = {};

        return Exploration.all(query, callback);
    };

    function getResults(request, callback) {
        var currentUser = request.user;

        if (!currentUser || !currentUser.id) {
            return reject('user required', callback);
        }

        var query = {
            where: {
                id: request.query.explorationId,
            },
            include: {
                relation: 'records',
                scope: {
                    where: {
                        explorationId: request.query.explorationId,
                        userId: currentUser.id
                    }
                }
            }
        };

        var ExplorationRecord = Exploration.app.models.ExplorationRecord;

        Exploration.findOne(query, function(error, exploration) {
            if (error) {
                return callback(error);
            }

            if (!exploration) {
                return reject('not found', callback);
            }

            if (!exploration.algorithm && exploration.pattern !== 'heatmap') {
                return reject('algorithm required', callback);
            }

            exploration = exploration.toJSON();
            var responses = {};

            exploration.records.map(function(model) {
                responses[model.question] = model.answer;
            });

            if (exploration.pattern === 'heatmap') {
                return heatmapResults(responses, exploration, Exploration, callback);
            }

            /**
             * Only way to identify this exploration for now
             */
            if (exploration.algorithm === 'watson') {
                return ExplorationRecord.getResults(exploration, currentUser.id, callback);
            }

            /**
             * TODO: Use algorithms object to define proper function to be used
             */
            if (exploration.algorithm === 'asq') {
                markAsCompleted(exploration.id, request, Exploration);

                return asq(agree, disagree, responses, function(score) {

                    var response = {
                        score: score,
                        max: agree.length + disagree.length,
                        min: 0,
                        pattern: exploration.pattern,
                        slug: exploration.slug,
                        name: exploration.name,
                        description: exploration.description,
                        resultDisplayType: exploration.resultDisplayType
                    };

                    var model = {
                        userId: currentUser.id,
                        explorationId: exploration.id,
                        result: response,
                        createdAt: new Date()
                    };

                    ExplorationRecord.createRecord(model);
                    return callback(null, response);
                });
            }

            if (exploration.algorithm === 'big5') {
                markAsCompleted(exploration.id, request, Exploration);

                return big5(matrix, responses, function(data) {
                    data.pattern = exploration.pattern;
                    data.description = exploration.description;
                    data.slug = exploration.slug;
                    data.name = exploration.name;
                    data.resultDisplayType = exploration.resultDisplayType;

                    var model = {
                        userId: currentUser.id,
                        explorationId: exploration.id,
                        result: data,
                        createdAt: new Date()
                    };

                    ExplorationRecord.createRecord(model);
                    return callback(null, data);
                });
            }
        });
    }

    Exploration.getExploration = function(slug, request, callback) {

        if (request.query.results && request.query.explorationId) {
            return getResults(request, callback);
        }

        var user = request.user;

        var fields = [
            'name', 'slug', 'pattern', 'image', 'id',
            'description', 'category', 'analyzer', 'resultExplanation',
            'resultDisplayType'
        ];

        var query = {
            where: {
                slug: slug
            },
            fields: fields,
            include: [{
                relation: 'questions',
                scope: {
                    fields: ['order', 'question']
                }
            }, {
                relation: 'answers',
                scope: {
                    fields: ['order', 'answer']
                }
            }]
        };

        if (user && user.id) {
            query.include.push({
                relation: 'records',
                scope: {
                    order: ['createdAt ASC'],
                    where: {
                        userId: user.id
                    },
                    fields: ['answer', 'question', 'createdAt']
                }
            });
        }

        return Exploration.findOne(query, function(error, data) {
            if (error) {
                return callback(error);
            }

            if (!data) {
                return callback(data);
            }

            data = data.toJSON();

            /**
             * If there are answers, add each one to corresponding question
             */
            if (data.records && data.records.length) {
                var responses = fromArray(data.records, 'question');
                data.questions.map(function(question) {
                    var id = question.order;
                    question.answer = responses[id] ? responses[id].answer : '';
                });
            }

            data.records = null;
            return callback(null, data);
        });
    };
};
