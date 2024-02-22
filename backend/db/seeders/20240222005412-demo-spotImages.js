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
        url: 'this/is/a/url',
        preview: true
      },
      {
        spotId: 1,
        url: 'this/is/a/url',
        preview: false
      },
      {
        spotId: 2,
        url: 'this/is/a/url',
        preview: true
      },
      {
        spotId: 2,
        url: 'this/is/a/url',
        preview: false
      },
      {
        spotId: 3,
        url: 'this/is/a/url',
        preview: true
      },
      {
        spotId: 3,
        url: 'this/is/a/url',
        preview: false
      },
      {
        spotId: 4,
        url: 'this/is/a/url',
        preview: true
      },
      {
        spotId: 4,
        url: 'this/is/a/url',
        preview: false
      },
      {
        spotId: 5,
        url: 'this/is/a/url',
        preview: true
      },
      {
        spotId: 5,
        url: 'this/is/a/url',
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
