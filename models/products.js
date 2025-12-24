'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Categories, ImagesProducts, Ordersdetail, Carts, GRNdetails, Reviews, Pro_translation }) {
      // define association here
      this.belongsTo(Categories, {
        foreignKey: 'categoriesid',
        as: 'cate'
      });
      this.hasMany(ImagesProducts, {
        foreignKey: 'productid'
      });
      this.hasMany(Ordersdetail, {
        foreignKey: 'productid'
      });
      this.hasMany(Carts, {
        foreignKey: 'productid'
      });
      this.hasMany(GRNdetails, {
        foreignKey: 'productid'
      });
      this.hasMany(Reviews, {
        foreignKey: 'productid'
      });
      this.hasMany(Pro_translation, {
        foreignKey: 'productid',
        as: 'translations'
      });
      this.hasMany(Flashsaledetails, {
        foreignKey: "productid",
      });
    }
  }
  Products.init(
    {
      categoriesid: DataTypes.INTEGER,

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
