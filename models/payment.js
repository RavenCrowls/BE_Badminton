'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Orders }) {
      // define association here
      this.belongsTo(Orders, { foreignKey: 'orderid' });
    }
  }
  Payment.init({
    transactionid: DataTypes.STRING,
    orderid: DataTypes.STRING,
    paymentmethod: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};