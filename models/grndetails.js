'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GrnDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Grns, Products }) {
      // define association here
      this.belongsTo(Grns, { foreignKey: 'grnid' });
      this.belongsTo(Products, { foreignKey: 'productid' });
    }
  }
  GrnDetails.init({
    grnid: DataTypes.INTEGER,
    productid: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'GrnDetails',
  });
  return GrnDetails;
};