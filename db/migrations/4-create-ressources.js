'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Ressources', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      key: {
        allowNull: false,
        type: Sequelize.STRING
      },
      has_procedure: {
        allowNull: true,
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      is_essential: {
        allowNull: true,
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      link: {
        allowNull: true,
        type: Sequelize.STRING
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      file_name: {
        allowNull: true,
        type: Sequelize.STRING
      },
      file_size: {
        allowNull: true,
        type: Sequelize.FLOAT(3)
      },
      describ: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      createdDate: {
        allowNull: false,
        type: Sequelize.STRING
      },
      updatedDate: {
        allowNull: true,
        type: Sequelize.STRING
      },
      type : {
        allowNull: false,
        type: Sequelize.STRING
      },
      visibility : {
        allowNull: false,
        type: Sequelize.STRING
      },
      macOSX : {
        allowNull: true,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      linux : {
        allowNull: true,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      windows : {
        allowNull: true,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
    }, {timestamps: false});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Ressources');
  }
};