/**
 * Send notification about new comment being added to the post
 */
'use strict';
let email = require('../../lib/email');
const TEMPLATE = process.env.WAYBOOK_NOTIFY_COMMENT;

let data = {
    to: '',
    subject: ' ',
    substitutions: {},
    templateId: TEMPLATE,
    text: ' ',
    html: ' '
};

module.exports = content => {
    console.log(content);
    console.log(content.owner);

    return new Promise((resolve, reject) => {
        data.to = content.owner.email;

        email(data, (error, data) => {
            return error ? reject(error) : resolve(data);
        });
    });
};
