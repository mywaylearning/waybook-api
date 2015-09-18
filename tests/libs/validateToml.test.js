'use strict';
var tape = require('tape');
var validate = require('../../lib/validateToml');

tape('Validate toml schema', function(test) {
    test.plan(2);

    var validSchema = {
        meta: {
            name: 'foo',
            version: '1',
            slug: 'slug',
            pattern: 'pattern',
            image: 'foo',
            category: 'foo',
            description: 'desc',
            analyzer: true,
        },
        questions: {
            '1': 'foo'
        },
        answers: {
            '1': 'bar'
        }
    };

    var result = validate(validSchema);
    test.equal(result._error, undefined, 'with proper schema, should return valid');

    var invalidSchema = validSchema;
    invalidSchema.questions = null;

    result = validate(invalidSchema);
    test.equal(result._error, true, 'without proper schema, should return error');
});
