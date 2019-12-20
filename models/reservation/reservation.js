const Sequelize = require('sequelize');
const dbConnection = require('../../config').dbConnection;
const Reservation = dbConnection.define('reservations', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
},
{
  // options
  timestamps: false
});

module.exports = Reservation;