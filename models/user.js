const Sequelize = require('sequelize');
const User = dbConnection.define('users', {
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
},
{
  // options
  timestamps: false
});

module.exports = User;