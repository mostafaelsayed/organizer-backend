const Sequelize = require('sequelize');
const dbConnection = require('../../config').dbConnection;
const User = dbConnection.define('users', {
  // attributes

  // assume primary key by default
  // id: {
  //     type: Sequelize.INTEGER,
  //     allowNull: false,
      
  // },
  email: {
    type: Sequelize.STRING,
  },
  firstName: {
    type: Sequelize.STRING,
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
  },
  facebook_id: {
    type: Sequelize.STRING,
  },
  facebook_access_token: {
    type: Sequelize.STRING,
  }
},
{
  // options
  timestamps: false
});

module.exports = User;