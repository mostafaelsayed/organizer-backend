const Sequelize = require('sequelize');
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