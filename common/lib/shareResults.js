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


    let exploration = {
        pattern: data.pattern,
        slug: data.slug,
        name: data.name,
        resultDisplayType: data.resultDisplayType
    };

    delete data.pattern;
    delete data.slug;
    delete data.name;
    delete data.resultDisplayType;

    post.results = [exploration, data];

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
