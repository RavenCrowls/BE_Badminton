'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  static associate({ Categories, ImagesProducts, OrdersDetails, Carts, GrnDetails }) {
      // define association here
      this.belongsTo(Categories, {
        foreignKey: 'categoriesid'
      });
      this.hasMany(ImagesProducts, {
        foreignKey: 'productid'
      });
    this.hasMany(OrdersDetails, {
      foreignKey: 'productid'
    });
    this.hasMany(Carts, {
      foreignKey: 'productid'
    });
    this.hasMany(GrnDetails, {
      foreignKey: 'productid'
    });
    }
  }
  Products.init(
    {
      name: DataTypes.STRING,
      categoriesid: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      price: DataTypes.INTEGER,
      brand: DataTypes.STRING,
      quantity: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Products'
    }
  );
  return Products;
};
