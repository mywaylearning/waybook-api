'use strict';

var server = require('../server/server.js');

var modelNames = Object.keys(server.models);
var dataSource = server.dataSources.db;
dataSource.automigrate('WaybookUser');
// console.log(modelNames);
// function createOrUpdate(table) {
//   dataSource.autoMigrate(table, function(err, result) {
//     if (err) {
//       throw err;
//     }
//     console.log(result);
//   });
// }
//
// modelNames.forEach(createOrUpdate);

// var dskeys = Object.keys(server.dataSources);
// console.log(dskeys);
// modelNames.forEach(function(name) {
//   var ds = server.models[name].getDataSource();
//   ds.autoMigrate
// });




process.exit(0);
