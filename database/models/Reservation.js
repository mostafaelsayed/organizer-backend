'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define('Reservation', {
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    createdAt: DataTypes.DATE
  }, {
    timestamps: false
  });
  Reservation.associate = function(models) {
    // associations can be defined here
    Reservation.belongsTo(models.User, {foreignKey: 'userId'})
  };
  return Reservation;
};