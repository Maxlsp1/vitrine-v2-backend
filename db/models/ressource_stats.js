'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ressource_Stats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    Ressource_Stats.belongsTo(models.Ressources, {
        foreignKey: {
          name: 'RessourceId',
          allowNull: true
        },
        foreignKeyConstraint: 'fk_Ressource_Stats_RessourcesId'
      })
    }
  };
  Ressource_Stats.init({
    get_date: DataTypes.DATEONLY,
    get_time: DataTypes.TIME,
    RessourceId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Ressource_Stats',
    createdAt: false,
    updatedAt: false,
  });
  return Ressource_Stats;
};