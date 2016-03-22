/**
 * Notify post owner about new comment added
 */
'use strict';

module.exports = (context, Post) => {

    let filter = {
        where: {
            id: context.instance.postId
        },
        include: [{
            relation: 'WaybookUser',
            scope: {
                fields: ['id', 'firstName', 'lastName', 'email']
            }
        }]
    };

    return new Promise((resolve, reject) => {
        Post.findOne(filter, (error, found) => {
            if (error) {
                return reject(error);
            }

            if (context.instance.userId === found.userId) {
                return reject('same user');
            }

            let data = {
                comment: context.instance,
                post: found,
                owner: found.toJSON().WaybookUser
            };

            return resolve(data);
        });
    });
};
