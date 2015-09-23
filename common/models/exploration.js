'use strict';
var reject = require('../helpers/reject');
var fromArray = require('../helpers/fromArray');

module.exports = function(Exploration) {

    Exploration.put = function(id, data, request, callback) {
        if (!id || !data) {
            return reject('params required', callback);
        }

        var currentUser = request.user;

        if (!currentUser || !currentUser.id) {
            return reject('user required', callback);
        }

        data.explorationId = id;
        data.userId = currentUser.id;

        var query = {
            where: {
                userId: currentUser.id,
                question: data.question,
                explorationId: id,
                answer: data.answer
            }
        };

        Exploration.app.models.Record.findOrCreate(query, data, callback);
    };

    Exploration.indexExploration = function(request, callback) {

        var query = {
            // include: ['questions', 'answers']
        };

        return Exploration.all(query, callback);
    };

    Exploration.getExploration = function(slug, request, callback) {
        var user = request.user;

        var fields = [
            'name', 'slug', 'pattern', 'image', 'id', 'description', 'category'
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

        if (user) {
            query.include.push({
                relation: 'records',
                scope: {
                    fields: ['answer', 'question']
                }
            });
        }

        return Exploration.findOne(query, function(error, data) {
            if (error) {
                return callback(error);
            }

            data = data.toJSON();
            /**
             * If there are answers, add each to corresponding question
             */
            if (data.records && data.records.length) {
                var responses = fromArray(data.records, 'question');
                data.questions.map(function(question) {
                    var id = question.order;
                    question.answer = responses[id] ? responses[id].answer : '';
                });
            }
            return callback(null, data);
        });
    };
};
