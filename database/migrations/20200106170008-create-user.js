'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      passwordHash: {
        type: Sequelize.STRING
      },
      facebook_id: {
        type: Sequelize.STRING
      },
      facebook_access_token: {
        type: Sequelize.STRING
      },
      email_verified: {
        type: Sequelize.BOOLEAN
      },
      email_verification_code: {
        type: Sequelize.STRING
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};