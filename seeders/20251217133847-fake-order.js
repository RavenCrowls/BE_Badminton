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
    await queryInterface.bulkInsert('orders', [
      {
        userid: 1,
        totalprice: 390000, // 130,000 × 3
        phonenumber: '0912345678',
        address: '123 Đường Trần Hưng Đạo, Quận 1, TP.HCM',
        promotionid: null,
        status: 1,
        process: new Date('2025-11-02'),
        shipping: new Date('2025-11-04'),
        delivered: new Date('2025-11-07'),
        createdAt: new Date('2025-11-02'),
        updatedAt: new Date('2025-11-02')
      },
      {
        userid: 2,
        totalprice: 265000, // 120,000 + 145,000
        phonenumber: '0988123456',
        address: '56 Nguyễn Huệ, Quận 1, TP.HCM',
        promotionid: null,
        status: 1,
        process: new Date('2025-11-10'),
        shipping: new Date('2025-11-12'),
        delivered: new Date('2025-11-14'),
        createdAt: new Date('2025-11-10'),
        updatedAt: new Date('2025-11-10')
      },
      {
        userid: 3,
        totalprice: 2490000, // (650,000 × 3) + (270,000 × 2)
        phonenumber: '0908765432',
        address: '21 Lê Lợi, Quận 3, TP.HCM',
        promotionid: null,
        status: 1,
        process: new Date('2025-11-20'),
        shipping: new Date('2025-11-22'),
        delivered: new Date('2025-11-25'),
        createdAt: new Date('2025-11-20'),
        updatedAt: new Date('2025-11-20')
      },
      {
        userid: 4,
        totalprice: 145000, // 1 sản phẩm giá 145,000
        phonenumber: '0977654321',
        address: '789 Cách Mạng Tháng 8, Quận 10, TP.HCM',
        promotionid: null,
        status: 1,
        process: new Date('2025-12-01'),
        shipping: new Date('2025-12-02'),
        delivered: new Date('2025-12-05'),
        createdAt: new Date('2025-12-01'),
        updatedAt: new Date('2025-12-01')
      },
      {
        userid: 5,
        totalprice: 430000, // 150,000 + 280,000
        phonenumber: '0911223344',
        address: '145 Phan Xích Long, Phú Nhuận, TP.HCM',
        promotionid: null,
        status: 1,
        process: new Date('2025-11-07'),
        shipping: new Date('2025-11-10'),
        delivered: new Date('2025-11-12'),
        createdAt: new Date('2025-11-07'),
        updatedAt: new Date('2025-11-07')
      },
      {
        userid: 1,
        totalprice: 150000, // 1 sản phẩm
        phonenumber: '0933456789',
        address: '200 Nguyễn Trãi, Quận 5, TP.HCM',
        promotionid: null,
        status: 1,
        process: new Date('2025-12-01'),
        shipping: new Date('2025-12-03'),
        delivered: new Date('2025-12-06'),
        createdAt: new Date('2025-12-01'),
        updatedAt: new Date('2025-12-01')
      },
      {
        userid: 2,
        totalprice: 340000, // 160,000 + 180,000
        phonenumber: '0967890123',
        address: '80 Lý Tự Trọng, Quận 1, TP.HCM',
        promotionid: null,
        status: 1,
        process: new Date('2025-11-18'),
        shipping: new Date('2025-11-19'),
        delivered: new Date('2025-11-22'),
        createdAt: new Date('2025-11-18'),
        updatedAt: new Date('2025-11-18')
      },
      {
        userid: 3,
        totalprice: 1748000, // (839,000 x 1) + (649,000 x 1) + (269,000 x 1)
        phonenumber: '0988765432',
        address: '302 Cộng Hòa, Tân Bình, TP.HCM',
        promotionid: null,
        status: 1,
        process: new Date('2025-11-25'),
        shipping: new Date('2025-11-27'),
        delivered: new Date('2025-11-29'),
        createdAt: new Date('2025-11-25'),
        updatedAt: new Date('2025-11-25')
      },
      {
        userid: 4,
        totalprice: 120000, // 1 sản phẩm
        phonenumber: '0919988776',
        address: '11 Võ Văn Ngân, Thủ Đức, TP.HCM',
        promotionid: null,
        status: 1,
        process: new Date('2025-11-29'),
        shipping: new Date('2025-12-01'),
        delivered: new Date('2025-12-03'),
        createdAt: new Date('2025-11-29'),
        updatedAt: new Date('2025-11-29')
      },
      {
        userid: 5,
        totalprice: 309000, // 130,000 + 179,000
        phonenumber: '0977332211',
        address: '45 Nguyễn Văn Cừ, Quận 5, TP.HCM',
        promotionid: null,
        status: 1,
        process: new Date('2025-11-10'),
        shipping: new Date('2025-11-12'),
        delivered: new Date('2025-11-15'),
        createdAt: new Date('2025-11-10'),
        updatedAt: new Date('2025-11-10')
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('orders', null, {});
  }
};
