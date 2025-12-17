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
    await queryInterface.bulkInsert(
      'categories',
      [
        {
          name: 'Racket',
          description: 'Các loại vợt cầu lông chất lượng cao từ các thương hiệu nổi tiếng.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Shoes',
          description: 'Giày chuyên dụng cho cầu lông, thiết kế nhẹ, thoáng khí và bám sân tốt.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Clothes',
          description: 'Bộ sưu tập quần áo thể thao dành cho người chơi cầu lông, thoáng mát và thoải mái.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Bags',
          description: 'Bao đựng vợt cầu lông với nhiều kích cỡ và kiểu dáng đa dạng.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Shuttlecock',
          description: 'Các loại cầu lông với chất liệu và độ bền khác nhau, phù hợp cho luyện tập và thi đấu.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Others',
          description: 'Phụ kiện và thiết bị khác liên quan đến cầu lông.',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('categories', null, {});
  }
};
