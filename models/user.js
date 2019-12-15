var Sequelize = require('sequelize');
var sequelizeConnection = require('../database/connection.js');

const User = sequelizeConnection.define('users', {
    // attributes

    // assume primary key by default
    // id: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
        
    // },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      // allowNull defaults to true
    },
    phoneNumber: {
        type: Sequelize.STRING,
    },
    passwordHash: {
        type: Sequelize.STRING,
    }
  }, {
    // options
    timestamps: false
});

exports.User = User;