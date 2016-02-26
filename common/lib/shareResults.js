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
        description: data.description,
        slug: data.slug,
        name: data.name,
        resultDisplayType: data.resultDisplayType
    };

    delete data.pattern;
    delete data.description;
    delete data.slug;
    delete data.name;
    delete data.resultDisplayType;

    post.results = [exploration, data];

    post.systemTags = ['discovery'];
    post.tags = ['exploration'];
    post.userId = user.id;
    post.postType = DISCOVERY;

    return Post.create(post, function(error, created) {
        if (error) {
            return callback(error);
        }

        return callback(null, created);
    });
};
