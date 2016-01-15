'use strict';
var tape = require('tape');
var method = require('../../common/helpers/emailContactData');

tape('prepare data to sent email to Contact', test => {
    test.plan(5);

    let data = {
        to: '',
        subject: ' ',
        substitutions: {},
        templateId: 'some object',
        text: ' ',
        html: ' '
    };

    let user = {
        firstName: 'foo',
        lastName: 'bar'
    };

    let contact = {
        firstName: 'contact',
        email: 'foo@bar.com'
    };

    var result = method(data, contact, user);
    let substitutions = result.substitutions || {};

    test.equal(substitutions['-name-'], 'contact', 'proper contact name');
    test.equal(substitutions['-firstName-'], 'foo', 'proper learner name');
    test.equal(substitutions['-lastName-'], 'bar', 'proper learner lastname');
    test.equal(result.to[0], 'foo@bar.com', 'proper contact email');
    test.equal(!!result.subject, true, 'subject should be defined');

});
