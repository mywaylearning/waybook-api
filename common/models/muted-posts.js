'use strict';

module.exports = function(MutedPosts) {

    let newOne = (model, resolve, reject) => {
        model.archived = false;
        return MutedPosts.create(model, (error, record) => {
            error ? reject(error) : resolve(record);
        });
    };

    /**
     * Get all muted posts id's from specific userId,
     * Returns a promise
     */
    MutedPosts.byUserId = function(userId) {
        let query = {
            where: {
                userId: userId,
                archived: false
            }
        };

        return new Promise((resolve, reject) => {
            MutedPosts.find(query, (error, posts) => {
                error ? reject(error) : resolve(posts);
            });
        });
    };

    /**
     * Toggle Post status: muted or not
     * We are using a property to 'un-mute' a post. If we want to `mute` a post
     * we just create a new record, therefore, if we need to `un-mute` it, we
     * update a record and set archived = true
     */
    MutedPosts.toggle = (userId, postId, mute) => {
        let model = {
            userId: userId,
            postId: postId
        };

        let query = {
            where: {
                userId: userId,
                postId: postId,
                archived: false
            }
        };

        return new Promise((resolve, reject) => {

            let callback = (error, found) => {
                if (error) {
                    return reject(error);
                }

                /**
                 * If we want to mute ( mute = yes) and we dont have any
                 * archived record
                 */
                if (mute && !found) {
                    return newOne(model, resolve, reject);
                }

                if (found && mute) {
                    return found.updateAttributes({
                        archived: true
                    }, (error, deleted) => {
                        return error ? reject(error) : resolve(deleted);
                    });
                }

                if (found && !mute) {
                    return resolve(found);
                }

                if (!found && !mute) {
                    return resolve({});
                }
            };

            MutedPosts.findOne(query, callback);
        });
    };
};
