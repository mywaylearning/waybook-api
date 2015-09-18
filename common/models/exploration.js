'use strict';

module.exports = function(Exploration) {
    Exploration.indexExploration = function(request, callback) {

        var query = {
            include: ['questions', 'answers']
        };
        return Exploration.all(query, callback);
    };
};
