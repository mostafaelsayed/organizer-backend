const Sequelize = require('sequelize');

var config = {};

// remote
if (process.env.JAWSDB_URL) {
    config = process.env.JAWSDB_URL;
}
else {
    config = require('./config.json')['dev']['url'];
}

// Option 1: Passing parameters separately
// const sequelize = new Sequelize(config['database'], config['username'], config['password'], {
//     host: config['localhost'],
//     /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
//     dialect: 'mysql'
// });


// Option 2: Passing a connection URI
//export default new Sequelize(config);

const sequelize = new Sequelize(config);

exports.sequelize = sequelize;
