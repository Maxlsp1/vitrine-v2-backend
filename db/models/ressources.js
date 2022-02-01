'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ressources extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Ressources.hasMany(models.Images)
      Ressources.hasMany(models.Feedback)
      Ressources.hasMany(models.Ressource_Stats)
      Ressources.hasOne(models.Ressources_docs)
    }
  };
  Ressources.init({
    key: DataTypes.STRING,
    has_procedure: DataTypes.BOOLEAN,
    is_essential: DataTypes.BOOLEAN, 
    link: DataTypes.STRING,
    file_name: DataTypes.STRING,
    file_size: DataTypes.FLOAT,
    name: DataTypes.STRING,
    describ: DataTypes.TEXT,
    createdDate: DataTypes.STRING,
    updatedDate: DataTypes.STRING,
    type: DataTypes.STRING,
    visibility: DataTypes.STRING,
    macOSX: DataTypes.BOOLEAN,
    linux: DataTypes.BOOLEAN,
    windows: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Ressources',
    createdAt: false,
    updatedAt: false,
  });
  return Ressources;
};