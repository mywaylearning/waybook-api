'use strict';

module.exports = function(post, currentUser) {
    var names = [];
    var links = [];
    var emails = [];
    var learnerFirstNames = [];
    var learnerLastNames = [];
    var postType = [];

    var substitutions = {};
    var link = process.env.WAYBOOK_WEB_CLIENT_URL + 'goal/' + post.id;

    post.share.map(function(item) {
        /**
         * List of names, emails from each contact to share this post with
         */
        names.push(item.firstName || '');
        emails.push(item.email);

        /**
         * Learner information
         */
        learnerFirstNames.push(currentUser.firstName);
        learnerLastNames.push(currentUser.lastName);
        postType.push(post.postType);
        links.push(link);
    });

    substitutions['-firstName-'] = names;
    substitutions['-learnerFirstName-'] = learnerFirstNames;
    substitutions['-learnerLastName-'] = learnerLastNames;
    substitutions['-postType-'] = postType;
    substitutions['-link-'] = links;

    return {
        to: emails,
        substitutions: substitutions
    };
};
