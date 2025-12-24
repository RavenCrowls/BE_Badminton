'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GRNdetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ GRN, Products }) {
      // define association here
      this.belongsTo(GRN, { foreignKey: 'grnid' });
      this.belongsTo(Products, { foreignKey: 'productid' });
    }
  }
  GRNdetails.init(
    {
      grnid: DataTypes.INTEGER,
      productid: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'GRNdetails'
    }
  );
  return GRNdetails;
};
