'use strict';
var reject = require('../helpers/reject');

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

        var query = {
            where: {
                slug: slug
            },
            include: ['questions', 'answers']
        };

        if (user) {
            query.include.push('records');
        }

        return Exploration.findOne(query, callback);
    };
};
