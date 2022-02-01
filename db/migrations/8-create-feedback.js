'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Feedbacks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      rate: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      post_date: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      post_time: {
        allowNull: false,
        type: Sequelize.TIME
      },
      update_date: {
        allowNull: true,
        type: Sequelize.DATEONLY
      },
      update_time: {
        allowNull: true,
        type: Sequelize.TIME
      },
      RessourceId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {        
          model: 'Ressources',
          key: 'id'
        },
        onDelete: 'SET NULL',
      },
      UserId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {        
          model: 'Users',
          key: 'id'
        },
        onDelete: 'SET NULL',
      },
    },{timestamps: false});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Feedbacks');
  }
};