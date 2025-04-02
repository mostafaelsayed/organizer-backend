// filepath: c:\Users\mosta\Documents\PersonalApps\organizer-backend\database\connection.ts
import { Sequelize } from 'sequelize';

let config: string = '';

// remote
if (process.env.JAWSDB_URL) {
    config = process.env.JAWSDB_URL;
} else {
    const configFile = require('./config.json');
    config = configFile['dev']['url'];
}

// Option 1: Passing parameters separately
// const sequelize = new Sequelize(config['database'], config['username'], config['password'], {
//     host: config['localhost'],
//     /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
//     dialect: 'mysql'
// });

// Option 2: Passing a connection URI
// export default new Sequelize(config);

const sequelize = new Sequelize(config);

export default sequelize;