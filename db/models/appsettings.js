'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class appSettings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  appSettings.init({
    defaultBackground: DataTypes.BLOB,
    default_background_name: DataTypes.STRING,
    default_background_mimeType: DataTypes.STRING,
    defaultLogo: DataTypes.BLOB,
    default_logo_name: DataTypes.STRING,
    default_logo_mimeType: DataTypes.STRING,
    dbStorageLimit: DataTypes.FLOAT,
    storageLimitServer:DataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'appSettings',
    createdAt: false,
    updatedAt: false,
  });
  return appSettings;
};