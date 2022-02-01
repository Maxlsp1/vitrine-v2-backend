'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Docs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Docs.hasMany(models.Ressources_docs)
    }
  };
  Docs.init({
    file: DataTypes.BLOB,
  }, {
    sequelize,
    modelName: 'Docs',
    createdAt: false,
    updatedAt: false,
  });
  return Docs;
};