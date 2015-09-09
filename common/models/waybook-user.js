'use strict';

var email = require('../../lib/email');
var hat = require('hat');

var WEB = process.env.WAYBOOK_WEB_CLIENT_URL;
var templateId = process.env.WAYBOOK_CONFIRM_TEMPLATE_ID;
var verifyAgeTemplateId = process.env.WAYBOOK_VERIFY_AGE;
var recoveryTemaplateId = process.env.WAYBOOK_RECOVERY_PASSWORD;

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
        var filter = {};

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

    function recoveryPassword(userEmail, callback) {
        var query = {
            where: {
                email: userEmail
            }
        };

        return WaybookUser.find(query, function(error, user) {
            if (error) {
                return callback({
                    error: 'cant process request'
                });
            }

            if (!user) {
                return callback(null, {});
            }

            var link = WEB + 'login/recovery?t=' + hat();

            var data = {
                to: [userEmail],
                subject: ' ',
                templateId: recoveryTemaplateId,
                text: ' ',
                html: '<a href="-link-">link</a>'.replace(/-link-/g, link)
            };

            email(data, function(error, sent) {
                if (error) {
                    return callback({
                        error: 'cant process request'
                    });
                }
                console.log('recovery password sent', error, !!sent);

                return callback(null, {
                    email: 'sent'
                });
            });
        });
    }

    /**
     * POST /users
     */
    WaybookUser.createUser = function(user, request, callback) {

        var Contact = WaybookUser.app.models.Contact;
        var Share = WaybookUser.app.models.Share;

        var afterUpdateShares = function(error, shares) {
            console.log(error, shares);
        };

        if (user.recovery) {
            return recoveryPassword(user.recovery, callback);
        }

        if (user.verify) {
            return verify(user.verify, function(error, saved) {
                if (error) {
                    return callback(error, null);
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

                return callback(null, saved);
            });
        }

        /**
         * Generate a unique token
         */
        user.confirmationToken = hat();
        user.firstName = user.firstName || user.name;

        var link = WEB + 'login/verify?t=' + user.confirmationToken;

        var data = {
            to: [user.email],
            subject: 'Confirmation email',
            templateId: templateId,
            text: textTemplate.replace(/link/g, link),
            html: htmlTemplate.replace(/%link%/g, link)
        };

        var after = function(error, saved) {
            if (error) {
                return callback(error);
            }

            email(data, function(error, sent) {
                console.log(error || 'sent: ' + !!sent);
                return callback(null, saved);
            });
        };

        return WaybookUser.create(user, after);
    };

    /**
     * PUT /users/:id
     */
    WaybookUser.put = function(user, request, callback) {
        var currentUser = request.user;
        user.firstName = user.firstName || user.name;

        if (user.password && user.newPassword && user.newPassword !== user.confirmPassword) {
            return callback({
                error: 'password confirmation and password values must be the same'
            });
        }

        var after = function(stored, user) {

            stored.updateAttributes(user, function(error, saved) {
                if (error) {
                    return callback(error, null);
                }

                var age = new Date(user.birthDate).getTime();
                var now = new Date().getTime();
                var year = 31536000000;
                var userAge;

                if (age && (age < now)) {
                    userAge = (now - age) / year;
                }

                if (userAge && userAge > 13 && userAge < 18) {

                    var data = {
                        to: [user.parentEmail],
                        subject: ' ',
                        templateId: verifyAgeTemplateId,
                        substitutions: {
                            '-firstName-': [user.parentFirstName],
                            '-lastName-': [user.parentLastName]
                        },
                        text: ' ',
                        html: ' '
                    };

                    email(data, function(error, sent) {
                        console.log(error || 'sent to parent email: ' + !!sent);
                        return callback(null, saved);
                    });
                }

                return callback(null, error);
            });
        };

        return WaybookUser.findById(currentUser.id, function(error, stored) {
            if (error) {
                return callback(error);
            }

            if (!stored) {
                return callback({
                    error: 'not found'
                });
            }

            if (stored.id !== currentUser.id) {
                return callback({
                    error: 'not authorized'
                });
            }

            if (!user.password) {
                return after(stored, user);
            }

            stored.hasPassword(user.password, function(error, match) {
                console.log(error, match);
                if (error) {
                    return callback({
                        error: 'cant process request now'
                    });
                }

                if (!match) {
                    return callback({
                        error: 'invalid current password'
                    });
                }

                user.password = user.newPassword;
                return after(stored, user);
            });
        });
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
