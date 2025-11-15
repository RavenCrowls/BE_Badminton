'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  static associate({ Roles, ImagesUsers, Orders, Carts, Grns }) {
      // define association here
      this.belongsTo(Roles, {
        foreignKey: 'roleid'
      });
      this.hasMany(ImagesUsers, {
        foreignKey: 'userid'
      });
    this.hasMany(Orders, {
      foreignKey: 'userid'
    });
    this.hasMany(Carts, {
      foreignKey: 'userid'
    });
    this.hasMany(Grns, {
      foreignKey: 'userid'
    });
    }
  }
  Users.init(
    {
      name: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      gender: DataTypes.STRING,
      address: DataTypes.TEXT,
      phonenumber: DataTypes.STRING,
      roleid: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Users'
    }
  );
  return Users;
};
