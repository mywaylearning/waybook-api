'use strict';
var reject = require('../helpers/reject');

module.exports = function(Tag) {

    /**
     * @see http://apidocs.strongloop.com/loopback/#persistedmodel-findorcreate
     */
    Tag.createTag = function(text, callback) {
        var where = {
            text: text
        };

        return Tag.findOrCreate(where, callback);
    };

    function allTags(user, callback) {
        var Post = Tag.app.models.Post;

        var query = {
            where: {
                or: [{
                    postType: 'habit'
                }, {
                    postType: 'goal'
                }],
                userId: user.id,
            },
            fields: ['tags', 'id', 'content', 'postType']
        };

        return Post.find(query, function(error, data) {
            if (error) {
                return reject('error on get tags', callback);
            }

            if (!data) {
                return callback(null, []);
            }

            var tags = {};

            data.map(function(item) {
                item.tags.map(function(tag) {
                    tags[tag] = tag;
                });
            });

            return callback(null, Object.keys(tags));
        });
    }

    /**
     * Get tags based on input filter
     */
    Tag.tagsIndex = function(input, timeline, request, callback) {

        if (!input && !timeline) {
            return reject('either search or timeline param required', callback);
        }

        if (timeline) {
            return allTags(request.user, callback);
        }

        var query = {
            text: {
                like: '%' + input + '%'
            }
        };

        return Tag.find({
            where: query
        }, function(error, data) {
            console.log(error || data)
            return callback(null, data);
        });
    };

};
