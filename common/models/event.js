/**
 * Event Model
 *
 * Used to store events from the system.
 */
'use strict';

function validate(model) {
    return !!model.id;
}

function args(model) {
    return {
        userId: model.userId,
        object: model,
        modelName: model.modelName,
        modelId: model.object.id,
        action: model.action
    };
}

function create(model, callback, Event) {
    return Event.create(model, callback);
}

module.exports = function(Event) {

    Event.createEvent = function(model, action, callback) {

        callback = callback || function(error, event) {
            console.log('event created?', !!event, 'any error?', error);
        };

        if (!validate(model.object)) {
            return;
        }

        if (!model.userId) {
            console.log('can not log event, no user found');
            return;
        }

        model.action = action;
        return create(args(model), callback, Event);
    };
};
