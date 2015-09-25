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

    test.equal(emailData.to[0], 'foo@bar.com', 'should return proper email field');

    test.equal(
        emailData.substitutions['-firstName-'][0], 'foo',
        'should return proper names'
    );

    test.equal(
        emailData.substitutions['-learnerFirstName-'][0], 'bob',
        'should return proper learner fist name substitutions'
    );

    test.equal(
        emailData.substitutions['-learnerLastName-'][0], 'marley',
        'should return proper last names substitutions'
    );

    test.equal(
        emailData.substitutions['-postType-'][0], 'goal',
        'should return proper post types substitutions'
    );
});
