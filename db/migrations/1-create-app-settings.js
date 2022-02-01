'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('appSettings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      defaultBackground: {
        type: Sequelize.BLOB('medium'),
        allowNull: true
      },
      default_background_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      default_background_mimeType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      defaultLogo: {
        type: Sequelize.BLOB('medium'),
        allowNull: true
      },
      default_logo_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      default_logo_mimeType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      storageLimitServer: {
        type: Sequelize.FLOAT(3),
        allowNull: false
      },
      dbStorageLimit: {
        type: Sequelize.FLOAT(3),
        allowNull: false
      },
      storageLimitServer: {
        type: Sequelize.FLOAT(3),
        allowNull: false
      },
    }, {timestamps: false});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('appSettings');
  }
};