'use strict';

var file = require('fs');
var toml = require('toml-j0.4');
var path = '../explorations/base.toml';

file.readFile(path, 'utf8', function(error, content){
    if(error){
        return console.log(error);
    }
    console.log(toml.parse(content));
});
