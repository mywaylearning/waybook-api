'use strict';

module.exports = function(Exploration) {
    Exploration.indexExploration = function(request, callback) {

        var query = {
            include: ['questions', 'answers']
        };
        return Exploration.all(query, callback);
    };

    Exploration.getExploration = function(slug, request, callback) {
        var query = {
            where: {
                slug: slug
            },
            include: ['questions', 'answers']
        };

        return Exploration.findOne(query, callback);
    };
};
