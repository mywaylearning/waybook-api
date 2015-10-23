'use strict';
var async = require('async');

module.exports = function(WaybookUser, request, callback) {
    var user = request.user;
    var Contact = WaybookUser.app.models.Contact;
    var Post = WaybookUser.app.models.Post;

    return async.parallel({
            supporters: function(after) {
                Contact.count({
                    userId: user.id
                }, after);
            },

            discoveries: function(after) {
                Post.count({
                    userId: user.id,
                    postType: 'discovery'
                }, after);
            },
            goals: function(after) {
                Post.count({
                    userId: user.id,
                    postType: 'goal'
                }, after);
            }
        },
        callback);
};
