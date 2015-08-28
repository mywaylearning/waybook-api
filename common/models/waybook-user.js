'use strict';

var email = require('../../lib/email');
var hat = require('hat');

var WEB = process.env.WAYBOOK_WEB_CLIENT_URL;
var templateId = process.env.WAYBOOK_CONFIRM_TEMPLATE_ID;

/**
 * TODO: Text template should be set on email client, currently sengrid doesn't
 * allow this, in order to change text developer should deploy new release :(
 */
var textTemplate = 'You own your future.\n\nTo start using the Waybook, ' +
    'please verify your email address by simply clicking on this link.\n\n' +
    '<%body%>\n\n…way! helps youth, and what they become, unleash their true ' +
    'potential.\n\nCheers,\n\n...way!';

var htmlTemplate = '<a href="%link%">confirm your account</a>';

module.exports = function(WaybookUser) {

    WaybookUser.getAuthenticatedUser = function(request, callback) {
        var currentUser = request.user;
        var filter = {
            fields: {
                username: false
            }
        };

        WaybookUser.findById(currentUser.id, filter, callback);
    };

    var verify = function(token, callback) {
        var query = {
            where: {
                confirmationToken: token
            }
        };

        return WaybookUser.find(query, function(error, data) {
            if (error) {
                return callback(error);
            }

            if (!data || !data.length) {
                return callback({
                    error: 'invalid token or it has been used'
                });
            }

            /**
             * Reset confirmation token
             */
            data[0].confirmationToken = '';

            return WaybookUser.upsert(data[0], callback);
        });
    };

    /**
     * POST /users
     */
    WaybookUser.createUser = function(user, request, callback) {

        var Contact = WaybookUser.app.models.Contact;
        var Share = WaybookUser.app.models.Share;

        if (user.verify) {
            return verify(user.verify, callback);
        }

        /**
         * Generate a unique token
         */
        user.confirmationToken = hat();
        user.firstName = user.firstName || user.name;

        var link = WEB + 'verify?t=' + user.confirmationToken;

        var data = {
            to: [user.email],
            subject: 'Confirmation email',
            templateId: templateId,
            text: textTemplate.replace(/link/g, link),
            html: htmlTemplate.replace(/%link%/g, link)
        };

        var afterUpdateShares = function(error, shares) {
            console.log(error, shares);
        };

        var after = function(error, saved) {
            if (error) {
                return callback(error);
            }

            /**
             * Look for all contacts where `saved.email` equals `contact.email`,
             * set `contact.waybookId` to `saved.id`
             */
            Contact.updateWaybookIds(saved.id, saved.email, function(error, contacts) {
                if (error) {
                    return console.log('error on update contacts', error);
                }
                return Share.updateShareWith(contacts, saved.id, afterUpdateShares);
            });

            email(data, function(error, sent) {
                console.log(error || 'sent: ' + !!sent);
                return callback(null, saved);
            });
        };

        return WaybookUser.create(user, after);
    };

    WaybookUser.usersIndex = function(input, request, callback) {
        var query = {
            where: {}
        };

        if (input) {
            query.where.username = {
                like: '%' + input + '%'
            };
        }

        return WaybookUser.find(query, function(error, data) {
            if (error) {
                return callback(error);
            }

            /**
             * TODO: Define a schema to respond with(yml file)
             */
            var response = data.map(function(item) {
                return {
                    id: item.id,
                    email: item.email,
                    username: item.username
                };
            });

            return callback(null, response);
        });
    };
};
