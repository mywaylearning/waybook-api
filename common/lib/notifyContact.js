/**
 * Send email to new contact
 */

'use strict';

let email = require('../../lib/email');

const TEMPLATE = process.env.WAYBOOK_INVITE_CONTACT;

let data = {
    to: '',
    subject: ' ',
    substitutions: {},
    templateId: TEMPLATE,
    text: ' ',
    html: ' '
};

function setup(data, contact, user) {
    data = data || {};

    data.substitutions = {
        '-name-': contact.firstName || '',
        '-firstName-': user.firstName || '',
        '-lastName-': user.lastName || ''
    };

    data.to = [contact.email];
    data.subject = `${user.firstName} ${user.lastName} has listed you as an ally on the Waybook`;
    return data;
}

module.exports = function notifyContact(contact, currentUser, callback) {
    callback = callback || () => {};
    let emailData = setup(data, contact, currentUser);
    email(emailData, callback);
};
