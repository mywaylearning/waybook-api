'use strict';

module.exports = function(array, property){
    var response = {};
    array.map(function(item){
        response[item[property]] = item;
    });

    return response;
};
