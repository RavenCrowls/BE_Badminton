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
    await queryInterface.bulkInsert('ordersdetails', [
      {
        orderid: 1,
        productid: 12,
        quantity: 3,
        createdAt: new Date('2025-11-02'),
        updatedAt: new Date('2025-11-02')
      }, // 130,000 × 3 = 390,000
      {
        orderid: 2,
        productid: 26,
        quantity: 1,
        createdAt: new Date('2025-11-10'),
        updatedAt: new Date('2025-11-10')
      }, // 120,000
      {
        orderid: 2,
        productid: 18,
        quantity: 1,
        createdAt: new Date('2025-11-10'),
        updatedAt: new Date('2025-11-10')
      }, // 145,000
      {
        orderid: 3,
        productid: 19,
        quantity: 3,
        createdAt: new Date('2025-11-20'),
        updatedAt: new Date('2025-11-20')
      }, // 650,000 × 3 = 1,950,000
      {
        orderid: 3,
        productid: 22,
        quantity: 2,
        createdAt: new Date('2025-11-20'),
        updatedAt: new Date('2025-11-20')
      }, // 270,000 × 2 = 540,000
      {
        orderid: 4,
        productid: 18,
        quantity: 1,
        createdAt: new Date('2025-12-01'),
        updatedAt: new Date('2025-12-01')
      }, // 145,000
      {
        orderid: 5,
        productid: 14,
        quantity: 1,
        createdAt: new Date('2025-11-07'),
        updatedAt: new Date('2025-11-07')
      }, // 150,000
      {
        orderid: 5,
        productid: 23,
        quantity: 1,
        createdAt: new Date('2025-11-07'),
        updatedAt: new Date('2025-11-07')
      }, // 280,000
      {
        orderid: 6,
        productid: 13,
        quantity: 1,
        createdAt: new Date('2025-12-01'),
        updatedAt: new Date('2025-12-01')
      }, // 150,000
      {
        orderid: 7,
        productid: 21,
        quantity: 1,
        createdAt: new Date('2025-11-18'),
        updatedAt: new Date('2025-11-18')
      }, // 160,000
      {
        orderid: 7,
        productid: 27,
        quantity: 1,
        createdAt: new Date('2025-11-18'),
        updatedAt: new Date('2025-11-18')
      }, // 180,000
      {
        orderid: 8,
        productid: 16,
        quantity: 1,
        createdAt: new Date('2025-11-25'),
        updatedAt: new Date('2025-11-25')
      }, // 839,000
      {
        orderid: 8,
        productid: 6,
        quantity: 1,
        createdAt: new Date('2025-11-25'),
        updatedAt: new Date('2025-11-25')
      }, // 649,000
      {
        orderid: 8,
        productid: 22,
        quantity: 1,
        createdAt: new Date('2025-11-25'),
        updatedAt: new Date('2025-11-25')
      }, // 270,000
      {
        orderid: 9,
        productid: 26,
        quantity: 1,
        createdAt: new Date('2025-11-29'),
        updatedAt: new Date('2025-11-29')
      }, // 120,000
      {
        orderid: 10,
        productid: 12,
        quantity: 1,
        createdAt: new Date('2025-11-10'),
        updatedAt: new Date('2025-11-10')
      }, // 130,000
      {
        orderid: 10,
        productid: 28,
        quantity: 1,
        createdAt: new Date('2025-11-10'),
        updatedAt: new Date('2025-11-10')
      } // 179,000
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
