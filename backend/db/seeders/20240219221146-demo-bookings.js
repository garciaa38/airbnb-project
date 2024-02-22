'use strict';

const { Booking } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        userId: 2,
        spotId: 1,
        startDate: '2024-05-04',
        endDate: '2024-05-08'
      },
      {
        userId: 3,
        spotId: 1,
        startDate: '2024-05-09',
        endDate: '2024-05-12'
      },
      {
        userId: 4,
        spotId: 2,
        startDate: '2024-05-04',
        endDate: '2024-05-08'
      },
      {
        userId: 5,
        spotId: 2,
        startDate: '2024-05-09',
        endDate: '2024-05-12'
      },
      {
        userId: 6,
        spotId: 3,
        startDate: '2024-05-04',
        endDate: '2024-05-08'
      },
      {
        userId: 7,
        spotId: 3,
        startDate: '2024-05-09',
        endDate: '2024-05-12'
      },
      {
        userId: 8,
        spotId: 4,
        startDate: '2024-05-04',
        endDate: '2024-05-08'
      },
      {
        userId: 9,
        spotId: 4,
        startDate: '2024-05-09',
        endDate: '2024-05-12'
      },
      {
        userId: 10,
        spotId: 5,
        startDate: '2024-05-04',
        endDate: '2024-05-08'
      },
      {
        userId: 1,
        spotId: 5,
        startDate: '2024-05-09',
        endDate: '2024-05-12'
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      startDate: { [Op.in]: ['2024-05-04', '2024-05-09'] }
    }, {});
  }
};
