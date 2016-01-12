/**
 * When login with social networks, facebook, we need to check if provided
 * access token was delivered from Facebook
 *
 * @see http://goo.gl/0EPOf4
 */

'use strict';

var https = require('https');

module.exports = function verify(token, callback) {

    if (!token) {
        return callback(false);
    }

    var url = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';

    https.get(url + token, function(res) {
        var str = '';

        res.on('data', function(chunk) {
            str += chunk;
        });

        res.on('error', function(error) {
            console.log('error on get facebook token', error);
            return callback(false);
        });

        res.on('end', function() {
            var response = JSON.parse(str);
            return callback(response['expires_in'] && response['expires_in'] > 0);
        });
    }).end();
};
