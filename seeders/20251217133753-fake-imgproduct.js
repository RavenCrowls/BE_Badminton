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
      'imagesproducts',
      [
        {
          productid: 1,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704159/1_hlcx1a.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 2,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704190/2_kykmgn.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 3,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704216/3_v8lb4n.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 4,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704245/4_tzkmgx.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 5,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704266/5_mqcmvo.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 6,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704293/6_fcyi1g.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 7,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704318/7_dzwa7s.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 8,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704319/8_gr5sex.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 9,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704320/9_vduilz.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 10,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704320/10_a43msy.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 11,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704403/11_x5o05d.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 12,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704400/12_nmhepd.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 13,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704401/13_mc6rgd.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 14,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704402/14_mc9cfy.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 15,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704401/15_tqdgnb.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 16,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704490/16_odn9i2.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 17,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704486/17_uz6vie.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 18,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704487/18_fdqf21.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 19,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704487/19_qpsrqr.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 20,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704488/20_oe1nxr.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 21,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704564/21_sx8dua.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 22,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704564/22_lbrpcw.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 23,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704565/23_isamml.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 24,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704568/24_xqhnx8.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 25,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704570/25_dggeyr.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 26,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704650/26_hxp8vs.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 27,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704648/27_vvg5wc.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 28,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704648/28_beexx5.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 29,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704649/29_mh0p4o.jpg',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          productid: 30,
          url: 'https://res.cloudinary.com/dnbmh6lvq/image/upload/v1749704652/30_ctmfaj.jpg',
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
    await queryInterface.bulkDelete('imagesproducts', null, {});
  }
};
