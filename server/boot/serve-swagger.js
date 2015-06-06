'use strict';

var p = require('path');
var jf = require('jsonfile');
var _ = require('lodash');

module.exports = function serveSwaggerSpec(server) {

  var sendSwagger = function(req, res) {
    var doc = jf.readFileSync(p.join(process.cwd(), 'common', 'api', 'swagger.json'));
    var hasBasePath = Object.keys(doc).indexOf('basePath') !== -1;
    var version = require(p.join(process.cwd(), 'package.json')).version;
    doc.info.version = version;
    if (hasBasePath) {
      var headers = req.headers;
      // NOTE header names (keys) are always all-lowercase
      var proto = headers['x-forwarded-proto'] || req.protocol;
      var host = headers['x-forwarded-host'] || headers.host;
      doc.basePath = proto + '://' + host;
    }

    // clean out x-delete-op-keys
    if (doc['x-deletable-op-keys']) {
      _.forEach(doc.paths, function(operations, path) {

        _.forEach(operations, function(op, httpMethod) {

          _.forEach(op, function(opVal, opKey) {

            _.forEach(doc['x-deletable-op-keys'], function(deletableOpKey) {

              if (_.startsWith(opKey, deletableOpKey)) {
                delete(doc.paths[path][httpMethod][opKey]);
              }

            });

          });

        });

      });
      delete(doc['x-deletable-op-keys']);
    }
    res.status(200).send(doc);
  };

  server.get('/swagger.json', sendSwagger);
  server.post('/swagger', sendSwagger);

};
