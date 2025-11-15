'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrdersDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Orders, Products }) {
      // define association here
      this.belongsTo(Orders, { foreignKey: 'orderid' });
      this.belongsTo(Products, { foreignKey: 'productid' });
    }
  }
  OrdersDetails.init(
    {
      orderid: DataTypes.INTEGER,
      productid: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'OrdersDetails'
    }
  );
  return OrdersDetails;
};