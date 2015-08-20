'use strict';

module.exports = function(data, Share) {
    var parallel = {};

    if(!data.share){
        return parallel;
    };

    data.share.map(function(contact) {
        parallel[contact.id] = function(callback) {
            var inf = {
                userId: data.userId,
                postId: data.id,
                sharedWith: contact.id
            };

            Share.create(inf, callback);
        };
    });

    return parallel;
};
