'use strict';

module.exports = function(data, Share) {
    var parallel = {};

    if (!data.share) {
        return parallel;
    }

    data.share.map(function(contact) {
        if (!contact.id) {
            return;
        }

        parallel[contact.id] = function(callback) {
            var inf = {
                userId: data.userId,
                postId: data.id,
                sharedWith: contact.waybookId || null,
                withContact: contact.waybookId ? null : contact.id
            };

            Share.findOrCreate(inf, function(error, shared) {
                if (error) {
                    return callback(error);
                }

                var model = {
                    modelName: 'Share',
                    modelId: shared.id,
                    object: shared,
                    userId: data.userId,
                    action: data.sharedFrom ? 'RE-SHARED' : 'SHARE_POST'
                };

                /**
                 * Add entry to Events table. Track post shared
                 */
                Share.app.models.Event.createEvent(model, model.action);

                return callback(null, shared);
            });
        };
    });

    return parallel;
};
