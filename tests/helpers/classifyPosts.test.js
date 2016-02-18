'use strict';

var tape = require('tape');
var classifyPosts = require('../../common/helpers/classifyPosts');

tape('All questions should have an answer', function(test) {
    test.plan(4);

    let posts = [{
        postType: 'goal'
    },{
        postType: 'discovery'
    },{
        postType: 'resource'
    }];

    let result = classifyPosts(posts);
    test.equal(result.goals.length, 1, 'expect one goal');
    test.equal(result.discoveries.length, 1, 'expect one discovery');
    test.equal(result.resources.length, 1, 'expect one resource');
    test.equal(classifyPosts([]).goals.length, 0, 'expect key but no value');
});
