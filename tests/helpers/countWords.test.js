/**
 * Unit tests for count words helper
 */

'use strict';

var tape = require('tape');
var count = require('../../common/helpers/countWords');

tape('Count words from text', function(test) {
    test.plan(2);

    var empty = '';
    var text = 'Lorem ipsum dolor sit amet, consectetuer';

    test.equal(count(empty), 0, 'should return 0 for empty string');
    test.equal(count(text), 6, 'should return proper words count');
});
