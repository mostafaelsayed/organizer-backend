const utilOptions = { depth: null };
const dbConnection = require('./database/connection');
const util = require('util');

// global.utilOptions = utilOptions;
// global.dbConnection = dbConnection;
// global.util = util;
// global.port = process.env.PORT || 4000;

module.exports = {
    utilOptions: utilOptions,
    dbConnection: dbConnection,
    util: util,
    port: process.env.PORT || 4000
};