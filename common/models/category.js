'use strict';

module.exports = function(Category) {

    Category.indexCategory = function(request, callback) {

        var query = {};
        return Category.all(query, callback);
    };
};
