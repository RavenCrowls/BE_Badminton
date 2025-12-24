'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Users, Ordersdetail, Payment, Reviews }) {
      // define association here
      this.belongsTo(Users, {
        foreignKey: 'userid'
      });
      this.hasMany(Ordersdetail, {
        foreignKey: 'orderid'
      });
      this.hasMany(Payment, {
        foreignKey: 'orderid'
      });
      this.hasMany(Reviews, {
        foreignKey: 'orderid'
      });
    }
  }
  Orders.init(
    {
      userid: DataTypes.INTEGER,
      totalprice: DataTypes.INTEGER,
      phonenumber: DataTypes.STRING,
      address: DataTypes.STRING,
      promotionid: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      process: DataTypes.DATE,
      shipping: DataTypes.DATE,
      delivered: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'Orders'
    }
  );
  return Orders;
};
