/**
 * Based on some contect information, add new Entry to Events table
 */

'use strict';

var event = require('../helpers/eventData');

module.exports = function addEvent(context, Model) {
    var model = event(context);
    Model.app.models.Event.createEvent(model, model.action);
};
