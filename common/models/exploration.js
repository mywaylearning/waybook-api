'use strict';
var reject = require('../helpers/reject');
var fromArray = require('../helpers/fromArray');
var asq = require('../../lib/asq');

module.exports = function(Exploration) {

    Exploration.put = function(id, data, request, callback) {
        if (!id || !data) {
            return reject('params required', callback);
        }

        var currentUser = request.user;

        if (!currentUser || !currentUser.id) {
            return reject('user required', callback);
        }

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

            return Exploration.app.models.Record.create(data, callback);
        });
    };

    Exploration.indexExploration = function(request, callback) {

        var query = {};

        return Exploration.all(query, callback);
    };

    function getResults(request, callback) {
        if (!request.user || !request.user.id) {
            return reject('user required', callback);
        }

        var query = {
            where: {
                explorationId: request.query.explorationId,
                userId: request.user.id
            }
        };

        Exploration.app.models.Record.find(query, function(error, records) {
            var responses = {};
            records.map(function(model) {
                responses[model.question] = model.answer;
            });

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

            asq(agree, disagree, responses, function(score) {
                return callback(null, {
                    score: score
                });
            });
        });
    }

    Exploration.getExploration = function(slug, request, callback) {
        if (request.query.results, request.query.explorationId) {
            return getResults(request, callback);
        }

        var user = request.user;

        var fields = [
            'name', 'slug', 'pattern', 'image', 'id',
            'description', 'category'
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
                    fields: ['answer', 'question', 'createdAt']
                }
            });
        }

        return Exploration.findOne(query, function(error, data) {
            if (error) {
                return callback(error);
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
