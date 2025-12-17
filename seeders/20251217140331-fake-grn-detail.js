'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert('grndetails', [
      // GRN 1 - total 1,680,000
      {
        grnid: 1,
        productid: 3,
        price: 4200000,
        quantity: 1,
        createdAt: new Date('2025-11-03'),
        updatedAt: new Date('2025-11-03')
      }, // bán: 4,599,000
      {
        grnid: 1,
        productid: 4,
        price: 900000,
        quantity: 3,
        createdAt: new Date('2025-11-03'),
        updatedAt: new Date('2025-11-03')
      }, // bán: 950,000

      // GRN 2 - total 395,000
      {
        grnid: 2,
        productid: 26,
        price: 100000,
        quantity: 1,
        createdAt: new Date('2025-11-12'),
        updatedAt: new Date('2025-11-12')
      }, // bán: 120,000
      {
        grnid: 2,
        productid: 27,
        price: 170000,
        quantity: 1,
        createdAt: new Date('2025-11-12'),
        updatedAt: new Date('2025-11-12')
      }, // bán: 180,000
      {
        grnid: 2,
        productid: 28,
        price: 62000,
        quantity: 2,
        createdAt: new Date('2025-11-12'),
        updatedAt: new Date('2025-11-12')
      }, // bán: 60,000

      // GRN 3 - total 322,000
      {
        grnid: 3,
        productid: 11,
        price: 120000,
        quantity: 1,
        createdAt: new Date('2025-11-27'),
        updatedAt: new Date('2025-11-27')
      }, // bán: 129,000
      {
        grnid: 3,
        productid: 12,
        price: 120000,
        quantity: 1,
        createdAt: new Date('2025-11-27'),
        updatedAt: new Date('2025-11-27')
      }, // bán: 130,000
      {
        grnid: 3,
        productid: 15,
        price: 82000,
        quantity: 1,
        createdAt: new Date('2025-11-27'),
        updatedAt: new Date('2025-11-27')
      }, // bán: 130,000

      // GRN 4 - total 237,000
      {
        grnid: 4,
        productid: 21,
        price: 150000,
        quantity: 1,
        createdAt: new Date('2025-12-01'),
        updatedAt: new Date('2025-12-01')
      }, // bán: 160,000
      {
        grnid: 4,
        productid: 24,
        price: 87000,
        quantity: 1,
        createdAt: new Date('2025-12-01'),
        updatedAt: new Date('2025-12-01')
      }, // bán: 245,000

      // GRN 5 - total 815,000
      {
        grnid: 5,
        productid: 2,
        price: 500000,
        quantity: 1,
        createdAt: new Date('2025-12-08'),
        updatedAt: new Date('2025-12-08')
      }, // bán: 599,000
      {
        grnid: 5,
        productid: 5,
        price: 1310000,
        quantity: 1,
        createdAt: new Date('2025-12-08'),
        updatedAt: new Date('2025-12-08')
      }, // bán: 1,590,000
      {
        grnid: 5,
        productid: 6,
        price: 540000,
        quantity: 1,
        createdAt: new Date('2025-12-08'),
        updatedAt: new Date('2025-12-08')
      }, // bán: 649,000

      // GRN 6 - total: 244,000
      {
        grnid: 6,
        productid: 13,
        price: 135000,
        quantity: 1,
        createdAt: new Date('2025-11-15'),
        updatedAt: new Date('2025-11-15')
      }, // bán: 150,000
      {
        grnid: 6,
        productid: 14,
        price: 109000,
        quantity: 1,
        createdAt: new Date('2025-11-15'),
        updatedAt: new Date('2025-11-15')
      }, // bán: 150,000

      // GRN 7 - total: 408,000
      {
        grnid: 7,
        productid: 18,
        price: 135000,
        quantity: 1,
        createdAt: new Date('2025-11-23'),
        updatedAt: new Date('2025-11-23')
      }, // bán: 145,000
      {
        grnid: 7,
        productid: 15,
        price: 91000,
        quantity: 1,
        createdAt: new Date('2025-11-23'),
        updatedAt: new Date('2025-11-23')
      }, // bán: 130,000
      {
        grnid: 7,
        productid: 11,
        price: 91000,
        quantity: 2,
        createdAt: new Date('2025-11-23'),
        updatedAt: new Date('2025-11-23')
      }, // bán: 129,000

      // GRN 8 - total: 1,560,000
      {
        grnid: 8,
        productid: 25,
        price: 770000,
        quantity: 2,
        createdAt: new Date('2025-12-04'),
        updatedAt: new Date('2025-12-04')
      }, // bán: 869,000

      // GRN 9 - total: 355,000
      {
        grnid: 9,
        productid: 22,
        price: 125000,
        quantity: 1,
        createdAt: new Date('2025-12-10'),
        updatedAt: new Date('2025-12-10')
      }, // bán: 270,000
      {
        grnid: 9,
        productid: 23,
        price: 115000,
        quantity: 1,
        createdAt: new Date('2025-12-10'),
        updatedAt: new Date('2025-12-10')
      }, // bán: 280,000
      {
        grnid: 9,
        productid: 26,
        price: 115000,
        quantity: 1,
        createdAt: new Date('2025-12-10'),
        updatedAt: new Date('2025-12-10')
      }, // bán: 120,000

      // GRN 10 - total: 927,000
      { grnid: 10, productid: 16, price: 750000, quantity: 1, createdAt: new Date('2025-12-11'), updatedAt: new Date('2025-12-11') }, // bán: 839,000
      { grnid: 10, productid: 28, price: 59000, quantity: 3, createdAt: new Date('2025-12-11'), updatedAt: new Date('2025-12-11') }, // bán: 60,000
      { grnid: 10, productid: 21, price: 59000, quantity: 2, createdAt: new Date('2025-12-11'), updatedAt: new Date('2025-12-11') } // bán: 160,000
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('grndetails', null, {});
  }
};
