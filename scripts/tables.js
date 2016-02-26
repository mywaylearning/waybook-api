'use strict';

let server = require('../server/server.js');
let dataSource = server.dataSources.db;

dataSource.automigrate('WaybookUser');

process.exit(0);
