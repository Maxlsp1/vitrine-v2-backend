'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Cron_tasks_Settings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      scheduled_time: {
        type: Sequelize.STRING
      },
      is_active: {
        type: Sequelize.BOOLEAN
      }
    }, {timestamps: false});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Cron_tasks_Settings');
  }
};