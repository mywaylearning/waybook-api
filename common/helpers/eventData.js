/**
 * Form `Context` param, get event data required to add an entry to Events
 * table
 */
'use strict';

module.exports = function(context) {
    return {
        modelName: context.Model.modelName,
        modelId: context.instance.id,
        object: context.instance,
        userId: context.instance.userId,
        action: context.isNewInstance ? 'CREATE' : 'UPDATE'
    };
};
