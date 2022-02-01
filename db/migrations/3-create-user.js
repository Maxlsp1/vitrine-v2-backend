'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      accountType: {
        allowNull: true,
        type: Sequelize.STRING
      },
      username: {
        allowNull: true,
        type: Sequelize.STRING
      },
      password: {
        allowNull: true,
        type: Sequelize.STRING
      },
      mail: {
        allowNull: true,
        type: Sequelize.STRING
      },
      firstUse: {
        type: Sequelize.STRING
      },
      theme: {
        type: Sequelize.STRING
      },
      avatarName: {
        type: Sequelize.STRING
      },
      avatarColor: {
        type: Sequelize.STRING
      },
      notiffication: {
        type: Sequelize.STRING
      },
    }, {timestamps: false});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};