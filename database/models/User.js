'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    facebook_id: DataTypes.STRING,
    facebook_access_token: DataTypes.STRING,
    email_verified: DataTypes.BOOLEAN,
    email_verification_code: DataTypes.STRING
  }, {
    timestamps: false
  });
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Reservation, {foreignKey: 'userId'});
  };
  return User;
};