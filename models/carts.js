'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Carts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Users, Products }) {
      // define association here
      this.belongsTo(Users, { foreignKey: 'userid' });
      this.belongsTo(Products, { foreignKey: 'productid' });
    }
  }
  Carts.init({
    userid: DataTypes.INTEGER,
    productid: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    notes: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Carts',
  });
  return Carts;
};