'use strict';

const { Review } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        userId: 2,
        spotId: 1,
        review: 'This is test review 1',
        stars: 2
      },
      {
        userId: 3,
        spotId: 1,
        review: 'This is test review 2',
        stars: 5
      },
      {
        userId: 4,
        spotId: 2,
        review: 'This is test review 3',
        stars: 1
      },
      {
        userId: 5,
        spotId: 2,
        review: 'This is test review 4',
        stars: 4
      },
      {
        userId: 6,
        spotId: 3,
        review: 'This is test review 5',
        stars: 4
      },
      {
        userId: 7,
        spotId: 3,
        review: 'This is test review 6',
        stars: 3
      },
      {
        userId: 8,
        spotId: 4,
        review: 'This is test review 7',
        stars: 3
      },
      {
        userId: 9,
        spotId: 4,
        review: 'This is test review 8',
        stars: 2
      },
      {
        userId: 10,
        spotId: 5,
        review: 'This is test review 9',
        stars: 1
      },
      {
        userId: 1,
        spotId: 5,
        review: 'This is test review 10',
        stars: 5
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      review: { [Op.in]: ['This place rocks!'] }
    }, {});
  }
};
