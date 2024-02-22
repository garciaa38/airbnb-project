'use strict';

const { ReviewImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: 'this/is/a/url',
        preview: true
      },
      {
        reviewId: 2,
        url: 'this/is/a/url',
        preview: false
      },
      {
        reviewId: 3,
        url: 'this/is/a/url',
        preview: true
      },
      {
        reviewId: 4,
        url: 'this/is/a/url',
        preview: false
      },
      {
        reviewId: 5,
        url: 'this/is/a/url',
        preview: true
      },
      {
        reviewId: 6,
        url: 'this/is/a/url',
        preview: false
      },
      {
        reviewId: 7,
        url: 'this/is/a/url',
        preview: true
      },
      {
        reviewId: 8,
        url: 'this/is/a/url',
        preview: false
      },
      {
        reviewId: 9,
        url: 'this/is/a/url',
        preview: true
      },
      {
        reviewId: 10,
        url: 'this/is/a/url',
        preview: false
      },
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['this/is/a/url'] }
    }, {});
  }
};
