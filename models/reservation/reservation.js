const Sequelize = require('sequelize');
const dbConnection = require('../../config').dbConnection;
const User = require('../user/user');

const Reservation = dbConnection.define('reservations', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      // This is a reference to another model
      model: User,
 
      // This is the column name of the referenced model
      key: 'id',
 
      // This declares when to check the foreign key constraint. PostgreSQL only.
      //deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
  }
},
{
  // options
  timestamps: false
});

module.exports = Reservation;