/**
 * Prepare contact to be used on send an email to new Contact
 */

'use strict';

module.exports = function setup(data, contact, user) {
    data = data || {};

    data.substitutions = {
        '-name-': contact.firstName || '',
        '-firstName-': user.firstName || '',
        '-lastName-': user.lastName || ''
    };

    data.to = [contact.email];
    data.subject = `${user.firstName} ${user.lastName} has listed you as an ally on the Waybook`;
    return data;
};
