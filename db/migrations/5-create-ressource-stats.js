'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Ressource_Stats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      get_date: {
        type: Sequelize.DATEONLY
      },
      get_time: {
        type: Sequelize.TIME
      },
      RessourceId: {
        type: Sequelize.INTEGER
      }
    }, {timestamps: false});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Ressource_Stats');
  }
};