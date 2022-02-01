'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Ressources_docs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      RessourceId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {        
          model: 'Ressources',
          key: 'id'
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      DocId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {        
          model: 'Docs',
          key: 'id'
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },{timestamps: false});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Ressources_docs');
  }
};