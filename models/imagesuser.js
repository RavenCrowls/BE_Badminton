'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ImagesUsers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Users }) {
      // define association here
      this.belongsTo(Users, { foreignKey: 'userid' });
    }
  }
  ImagesUsers.init(
    {
      userid: DataTypes.INTEGER,
      url: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'ImagesUsers'
    }
  );
  return ImagesUsers;
};