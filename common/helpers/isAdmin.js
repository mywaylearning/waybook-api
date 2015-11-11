/**
 * Identify if an user is admin or not based on role property
 */

'use strict';

/**
 * Based on user object, define if user is or not admin
 */
module.exports = function(user) {
    if (!user || !user.role) {
        return false;
    }

    return user.role === 'admin';
};
