'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Feedback)
    }
  };
  User.init({
    name: DataTypes.STRING,
    mail: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    firstUse: DataTypes.STRING,
    theme: DataTypes.STRING,
    avatarName: DataTypes.STRING,
    avatarColor: DataTypes.STRING,
    accountType: DataTypes.STRING,
    notiffication: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    createdAt: false,
    updatedAt: false,
  });
  return User;
};