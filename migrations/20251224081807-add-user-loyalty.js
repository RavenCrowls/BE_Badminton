'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'loyaltypoint', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Column was never created, nothing to revert
  }
};
