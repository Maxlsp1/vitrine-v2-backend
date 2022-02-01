'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdSettings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  AdSettings.init({    
    Ldap_url: DataTypes.STRING,
    baseDNStaffUser: DataTypes.STRING,
    baseDNStaffGroup: DataTypes.STRING,
    baseDNStudentUser: DataTypes.STRING,
    baseDNStudentGroup: DataTypes.STRING,
    Ldap_username: DataTypes.STRING,
    Ldap_pass: DataTypes.STRING,
    Token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AdSettings',
    createdAt: false,
    updatedAt: false
  });
  return AdSettings;
};