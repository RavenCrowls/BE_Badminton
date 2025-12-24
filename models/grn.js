'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GRN extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ GRNdetails, Users }) {
      // define association here
      this.hasMany(GRNdetails, {
        foreignKey: 'grnid'
      });
      this.belongsTo(Users, {
        foreignKey: 'userid'
      });
    }
  }
  GRN.init(
    {
      date: DataTypes.DATE,
      totalprice: DataTypes.INTEGER,
      userid: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'GRN'
    }
  );
  return GRN;
};
