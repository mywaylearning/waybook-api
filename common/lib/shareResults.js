/**
 * Based on explorations results, create a discovery post
 */
'use strict';

const DISCOVERY = 'discovery';

module.exports = options => {

    let data = options.data;
    let user = options.user;
    let Post = options.model.app.models.Post;
    let callback = options.callback;

    let post = {};

    post.results = Object.keys(data).map(key => {
        let property = {};
        property[key] = data[key];
        return property;
    });

    post.userId = user.id;
    post.postType = DISCOVERY;
    post.created = new Date();

    return Post.create(post, function(error, created) {
        if (error) {
            return callback(error);
        }

        return callback(null, created);
    });
};
