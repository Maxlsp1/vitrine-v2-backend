'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Feedback.belongsTo(models.Ressources, {
        foreignKey: {
          name: 'RessourceId',
          allowNull: true
        },
        foreignKeyConstraint: 'fk_feedback_RessourceId'
      })

      Feedback.belongsTo(models.User, {
        foreignKey: {
          name: 'UserId',
          allowNull: true
        },
        foreignKeyConstraint: 'fk_feedback_UserId'
      })
    }
  };
  Feedback.init({
    title: DataTypes.STRING,
    text: DataTypes.TEXT,
    rate: DataTypes.INTEGER,
    post_date: DataTypes.DATEONLY,
    post_time: DataTypes.TIME,
    update_date: DataTypes.DATEONLY,
    update_time: DataTypes.TIME,
    RessourceId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Feedback',
    createdAt: false,
    updatedAt: false,
  });
  return Feedback;
};