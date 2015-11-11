'use strict';

var loopback = require('loopback');
var async = require('async');

function customRest(options) {
    var handlers; // cached handlers

    return function restApiHandler(req, res, next) {
        var app = req.app;

        if (!handlers) {
            handlers = [];

            var contextOptions = options.context;
            if (contextOptions !== false) {
                if (typeof contextOptions !== 'object') {
                    contextOptions = {};
                }
                handlers.push(loopback.context(contextOptions));
            }

            // skip app.isAuthEnabled, since we're using OAuth2 component

            handlers.push(function(req, res, next) {
                // need to get an instance of the customREST handler per request
                return app.handler('rest')(req, res, next);
            });
        }

        if (handlers.length === 1) {
            return handlers[0](req, res, next);
        }

        async.eachSeries(handlers, function(handler, done) {
            handler(req, res, done);
        }, next);
    };
}

module.exports = customRest;
