'use strict';

var email = require('../../lib/email');
var dashboard = require('./dashboard');
var Moment = require('moment');
var hat = require('hat');
var reject = require('../helpers/reject');
var isAdmin = require('../helpers/isAdmin');
var notFound = require('../helpers/notFound');
var notAuthorized = require('../helpers/notAuthorized');
var filterObjectFields = require('../helpers/filterObjectFields');

var WEB = process.env.WAYBOOK_WEB_CLIENT_URL;
var templateId = process.env.WAYBOOK_CONFIRM_TEMPLATE_ID;
var verifyAgeTemplateId = process.env.WAYBOOK_VERIFY_AGE;
var recoveryTemaplateId = process.env.WAYBOOK_RECOVERY_PASSWORD;

var segment = require('../../lib/segment');

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

    WaybookUser.afterSave = function(next) {
        segment.identify({
            userId: this.id,
            traits: {
                email: this.email,
                name: this.firstName
            }
        });
        next();
    };

    WaybookUser.dashboard = function(request, callback) {
        return dashboard(WaybookUser, request, callback);
    };

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

        return WaybookUser.find(query, function(error, users) {
            var user;
            if (users && users.length) {
                user = users[0];
            }

            if (error) {
                return callback({
                    error: 'cant process request'
                });
            }

            if (!user) {
                return callback(null, {});
            }

            var token = hat();
            var link = WEB + 'recover-password/' + token;
            var data = {
                to: [userEmail],
                subject: ' ',
                substitutions: {
                    '-firstName-': [user.firstName]
                },
                templateId: recoveryTemaplateId,
                text: ' ',
                html: '<a href="-link-">link</a>'.replace(/-link-/, link)
            };

            user.recoveryToken = token;

            WaybookUser.upsert(user, function() {});

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

    function changePassword(user, callback) {
        var query = {
            where: {
                recoveryToken: user.recoveryToken
            }
        };

        return WaybookUser.find(query, function(error, stored) {

            if (error) {
                return callback(error);
            }

            if (!stored || !stored.length) {
                return callback({
                    error: 'token used or not found'
                });
            }

            stored = stored[0];

            stored.password = user.password;
            stored.recoveryToken = null;
            return WaybookUser.upsert(stored, callback);
        });
    }

    function searchForWaybookUser(user, request, callback) {
        var OAuthAccessToken = WaybookUser.app.models.OAuthAccessToken;
        var Social = WaybookUser.app.models.Social;

        var query = {
            where: {
                email: user.email
            }
        };


        WaybookUser.findOne(query, function(error, data) {
            if (error) {
                console.log(error);
                return reject('cant process request', callback);
            }

            if (data) {

                // TODO: Validate token for current logged user
                Social.create({
                    provider: user.provider,
                    providerId: user.providerId,
                    email: user.email,
                    userId: data.id
                });

                var content = {
                    userId: data.id
                };

                /**
                 * Create a session manually since we cant use
                 *     WaybookUser.login(...)
                 * @see  /server/authentication.js
                 */
                return OAuthAccessToken.create(content, function(error, token) {
                    if (error) {
                        console.log('on OAuthAccessToken', error);
                        return callback(error);
                    }

                    var user = {
                        'access_token': token.id,
                        'expires_in': token.expiresIn,
                        'refresh_token': token.refreshToken,
                        scope: token.scopes ? token.scopes[0] : '',
                        'token_type': 'Bearer'
                    };
                    return callback(null, user);
                });
            }

            return callback({
                error: 'not found'
            });
        });

    }

    function fromSocial(user, request, callback) {
        var Social = WaybookUser.app.models.Social;
        var Share = WaybookUser.app.models.Share;
        var Contact = WaybookUser.app.models.Contact;
        var OAuthAccessToken = WaybookUser.app.models.OAuthAccessToken;

        var query = {
            where: {
                provider: user.provider,
                providerId: user.providerId,
                email: user.email
            }
        };

        Social.findOne(query, function(error, data) {
            if (error) {
                return callback(error);
            }

            /**
             * If social found, means we have already registered a user with
             * social media information
             */
            if (data) {

                var content = {
                    userId: data.userId
                };

                /**
                 * Create a session manually since we cant use
                 *     WaybookUser.login(...)
                 * @see  /server/authentication.js
                 */
                return OAuthAccessToken.create(content, function(error, token) {
                    if (error) {
                        return callback(error);
                    }

                    var user = {
                        'access_token': token.id,
                        'expires_in': token.expiresIn,
                        'refresh_token': token.refreshToken,
                        scope: token.scopes ? token.scopes[0] : '',
                        'token_type': 'Bearer'
                    };
                    return callback(null, user);
                });
            }

            if (!data && !user.password) {
                return searchForWaybookUser(user, request, callback);
            }

            if (!user.firstName || !user.password) {
                return reject('fields required', callback);
            }

            var after = function(error, saved) {
                if (error) {
                    return callback(error);
                }

                Social.create({
                    provider: user.provider,
                    providerId: user.providerId,
                    email: user.email,
                    userId: saved.id
                });

                var credentials = {
                    email: user.email,
                    password: user.password,
                };

                WaybookUser.login(credentials, function(error, token) {
                    if (error) {
                        return callback(error);
                    }

                    var user = {
                        'access_token': token.id,
                        'expires_in': token.expiresIn,
                        'refresh_token': token.refreshToken,
                        scope: token.scopes ? token.scopes[0] : '',
                        'token_type': 'Bearer'
                    };

                    /**
                     * Look for all contacts where `saved.email` equals `contact.email`,
                     * set `contact.waybookId` to `saved.id`
                     */
                    Contact.updateWaybookIds(saved.id, saved.email, function(error, contacts) {
                        if (error) {
                            return console.log('error on update contacts', error);
                        }

                        return Share.updateShareWith(contacts, saved.id, function() {});
                    });

                    return callback(null, user);
                });
            };
            return WaybookUser.create(user, after);
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
        if (user.provider && user.email && user.providerId) {
            return fromSocial(user, request, callback);
        }

        if (user.recovery) {
            return recoveryPassword(user.recovery, callback);
        }

        if (user.recoveryToken && user.password) {
            return changePassword(user, callback);
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

        if (!user.firstName || !user.password) {
            return reject('required fields', callback);
        }

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

            /**
             * Store date type
             */
            if (user.birthDate) {
                user.birthDate = new Moment(user.birthDate)._d;
            }

            stored.updateAttributes(user, function(error, saved) {
                if (error) {
                    return callback(error, null);
                }

                var age = new Moment().diff(user.birthDate, 'years');

                if (age > 13 && age < 18) {

                    var data = {
                        to: [user.parentEmail],
                        subject: ' ',
                        templateId: verifyAgeTemplateId,
                        substitutions: {
                            '-firstName-': [stored.firstName],
                            '-lastName-': [stored.lastName]
                        },
                        text: ' ',
                        html: ' '
                    };

                    email(data, function(error, sent) {
                        console.log(error || 'sent to parent email: ' + !!sent);
                        return callback(null, saved);
                    });
                }

                return callback(null, saved);
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

    /**
     * GET single user, it's used for admin purposes
     */
    WaybookUser.getUser = function(id, request, callback) {
        var currentUser = request.user;

        if (!id) {
            return reject('ID param required', callback);
        }

        if (!currentUser || !currentUser.id) {
            return reject('authenticated admin user is required', callback);
        }

        if (!isAdmin(currentUser)) {
            return notAuthorized(callback);
        }

        function after(error, data) {
            if (error) {
                return reject('error on loading user', callback);
            }

            if (!data) {
                return notFound(callback);
            }

            return callback(null, data);
        }

        return WaybookUser.findById(id, after);
    };

    /**
     * For admin users, get a list of system users
     */
    WaybookUser.usersIndex = function(input, request, callback) {

        var query = {};
        var user = request.user;

        if (!isAdmin(user)) {
            return notAuthorized(callback);
        }

        if (input) {
            query.or = [{
                username: {
                    like: '%' + input + '%'
                }
            }, {
                firstName: {
                    like: '%' + input + '%'
                }
            }, {
                lastName: {
                    like: '%' + input + '%'
                }
            }, {
                email: {
                    like: '%' + input + '%'
                }
            }];
        }

        function after(error, data) {
            if (error) {
                return reject('error loading users', callback);
            }

            /**
             * TODO: Define a schema to respond with(yml file)
             * UPDATE: Wit admin/users/ schema is not working, using helper
             * method to return proper data
             */
            var fields = ['id', 'firstName', 'lastName', 'username', 'created'];
            return callback(null, filterObjectFields(data, fields));
        }

        return WaybookUser.find({
            where: query
        }, after);
    };
};
