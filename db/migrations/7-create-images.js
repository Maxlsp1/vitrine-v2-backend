'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Images', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.BLOB('medium')
      },
      mime_type: {
        type: Sequelize.STRING
      },
      image_type: {
        type: Sequelize.STRING
      },
      RessourceId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {        
          model: 'Ressources',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },{timestamps: false});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Images');
  }
};