import { Sequelize } from 'sequelize';

let config: string = '';

if (process.env.JAWSDB_URL) {
    config = process.env.JAWSDB_URL;
}
else {
    const configFile = require('./config.json');
    config = configFile['dev']['url'];
}

const sequelize = new Sequelize(config);

export default sequelize;