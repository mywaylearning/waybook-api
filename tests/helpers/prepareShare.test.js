'use strict';
var tape = require('tape');
var prepareShare = require('../../common/helpers/prepareShare');

tape('prepareShare helper', function(test) {
    test.plan(5);

    var post = {
        share: [{
            email: 'foo@bar.com',
            firstName: 'foo'
        }],
        postType: 'goal',
        id: 1
    };

    var user = {
        firstName: 'bob',
        lastName: 'marley'
    };

    var emailData = prepareShare(post, user);

    test.equal(emailData.to[0], 'foo@bar.com');
    test.equal(emailData.substitutions['-firstName-'][0], 'foo');
    test.equal(emailData.substitutions['-learnerFirstName-'][0], 'bob');
    test.equal(emailData.substitutions['-learnerLastName-'][0], 'marley');
    test.equal(emailData.substitutions['-postType-'][0], 'goal');
    // test.equal(emailData.substitutions['-link-'][0], '');
});
