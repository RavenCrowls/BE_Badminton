'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Grns extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Users, GrnDetails }) {
      // define association here
      this.belongsTo(Users, { foreignKey: 'userid' });
      this.hasMany(GrnDetails, { foreignKey: 'grnid' });
    }
  }
  Grns.init(
    {
      date: DataTypes.DATE,
      totalprice: DataTypes.INTEGER,
      userid: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Grns'
    }
  );
  return Grns;
};