'use strict';

const { SpotImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'https://hips.hearstapps.com/hmg-prod/images/cozy-lake-cabin-michigan-exterior-1661195067.jpg',
        preview: true
      },
      {
        spotId: 1,
        url: 'https://hips.hearstapps.com/hmg-prod/images/suburban-house-royalty-free-image-1584972559.jpg',
        preview: false
      },
      {
        spotId: 2,
        url: 'https://img.freepik.com/free-photo/blue-house-with-blue-roof-sky-background_1340-25953.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://hips.hearstapps.com/hmg-prod/images/tiny-houses-1579284305.png',
        preview: false
      },
      {
        spotId: 3,
        url: 'https://img.freepik.com/free-photo/modern-house-architectural-design-photography_1409-6516.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://i.ytimg.com/vi/_L6jEtMK8No/maxresdefault.jpg',
        preview: false
      },
      {
        spotId: 4,
        url: 'https://www.bhg.com/thmb/H9VV9JNnKl-H1faFXnPlQfNprYw=/1799x0/filters:no_upscale():strip_icc()/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://www.houseplans.net/news/wp-content/uploads/2023/07/57260-768.jpeg',
        preview: false
      },
      {
        spotId: 5,
        url: 'https://www.tennessean.com/gcdn/presto/2019/10/11/PNAS/adf1101a-0f8c-404f-9df3-5837bf387dfd-1_Exterior_House_Beautiful_Whole_Home_Concept_House_Castle_Homes_Photo_Reed_Brown_Photography.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
        preview: false
      },
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['this/is/a/url'] }
    }, {});
  }
};
