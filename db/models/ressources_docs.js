'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ressources_docs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Ressources_docs.belongsTo(models.Ressources, {
        foreignKey: {
          name: 'RessourceId',
          allowNull: true
        },
        foreignKeyConstraint: 'fk_Ressources_docs_RessourcesId'
      })

      Ressources_docs.belongsTo(models.Docs, {
        foreignKey: {
          name: 'DocId',
          allowNull: true
        },
        foreignKeyConstraint: 'fk_Ressources_docs_DocsId'
      })
    }
  };
  Ressources_docs.init({
    RessourceId: DataTypes.INTEGER,
    DocId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Ressources_docs',
    createdAt: false,
    updatedAt: false,
  });
  return Ressources_docs;
};