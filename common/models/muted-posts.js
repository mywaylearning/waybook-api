'use strict';

module.exports = function(MutedPosts) {

    /**
     * Get all muted posts id's from specific userId,
     * Returns a promise
     */
    MutedPosts.byUserId = function(userId) {
        let query = {
            where: {
                userId: userId
            }
        };

        return new Promise((resolve, reject) => {
            MutedPosts.find(query, (error, posts) => {
                error ? reject(error) : resolve(posts);
            });
        });
    };
};
