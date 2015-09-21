'use strict';

module.exports = function(Category) {

    Category.indexCategory = function(request, callback) {

        var query = {
            include: ['explorations']
        };

        return Category.all(query, callback);
    };
};
