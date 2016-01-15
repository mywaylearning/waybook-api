/**
 * Send email to new contact
 */

'use strict';

let email = require('../../lib/email');
let setup = require('../helpers/emailContactData');
const TEMPLATE = process.env.WAYBOOK_INVITE_CONTACT;

let data = {
    to: '',
    subject: ' ',
    substitutions: {},
    templateId: TEMPLATE,
    text: ' ',
    html: ' '
};

module.exports = function notifyContact(contact, currentUser, callback) {
    callback = callback || () => {};
    let emailData = setup(data, contact, currentUser);
    email(emailData, callback);
};
