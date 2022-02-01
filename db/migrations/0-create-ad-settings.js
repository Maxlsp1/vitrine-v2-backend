'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AdSettings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Ldap_url: {
        allowNull: false,
        type: Sequelize.STRING
      }, 
      baseDNStaffUser: {
        allowNull: false,
        type: Sequelize.STRING
      }, 
      baseDNStaffGroup: {
        allowNull: false,
        type: Sequelize.STRING
      }, 
      baseDNStudentUser: {
        allowNull: false,
        type: Sequelize.STRING
      }, 
      baseDNStudentGroup: {
        allowNull: false,
        type: Sequelize.STRING
      }, 
      Ldap_username: {
        allowNull: false,
        type: Sequelize.STRING
      }, 
      Ldap_pass: {
        allowNull: false,
        type: Sequelize.STRING
      }, 
      Token: {
        allowNull: false,
        type: Sequelize.STRING
      },
    }, {timestamps: false});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('AdSettings');
  }
};