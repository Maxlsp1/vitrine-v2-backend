'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cron_tasks_Settings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Cron_tasks_Settings.init({
    name: DataTypes.STRING,
    scheduled_time: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Cron_tasks_Settings',
    createdAt: false,
    updatedAt: false,
  });
  return Cron_tasks_Settings;
};