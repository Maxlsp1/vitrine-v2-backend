'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Images extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Images.belongsTo(models.Ressources, {
        foreignKey: {
          name: 'RessourceId',
          allowNull: true
        },
        foreignKeyConstraint: 'fk_images_RessourcesId'
      })
    }
  };
  Images.init({
    name: DataTypes.STRING,
    image: DataTypes.BLOB,
    mime_type: DataTypes.STRING,
    image_type: DataTypes.STRING,
    RessourceId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Images',
    createdAt: false,
    updatedAt: false,
  });
  return Images;
};