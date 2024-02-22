'use strict';

const { Spot } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '1 demo ave.',
        city: 'DemoCity',
        state: 'California',
        country: 'United States of America',
        lat: 37.7645358,
        lng: -122.4730327,
        name: 'DemoPlace1',
        description: 'Come stay at this place that does not exist',
        price: 1200
      },
      {
        ownerId: 3,
        address: '2 demo ave.',
        city: 'DemoCity',
        state: 'California',
        country: 'United States of America',
        lat: 37.7645358,
        lng: -122.4730327,
        name: 'DemoPlace2',
        description: 'Come stay at this place that does not exist',
        price: 1200
      },
      {
        ownerId: 5,
        address: '3 demo ave.',
        city: 'DemoCity',
        state: 'California',
        country: 'United States of America',
        lat: 37.7645358,
        lng: -122.4730327,
        name: 'DemoPlace3',
        description: 'Come stay at this place that does not exist',
        price: 1200
      },
      {
        ownerId: 7,
        address: '4 demo ave.',
        city: 'DemoCity',
        state: 'California',
        country: 'United States of America',
        lat: 37.7645358,
        lng: -122.4730327,
        name: 'DemoPlace4',
        description: 'Come stay at this place that does not exist',
        price: 1200
      },
      {
        ownerId: 9,
        address: '5 demo ave.',
        city: 'DemoCity',
        state: 'California',
        country: 'United States of America',
        lat: 37.7645358,
        lng: -122.4730327,
        name: 'DemoPlace5',
        description: 'Come stay at this place that does not exist',
        price: 1200
      },
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['DemoPlace1', 'DemoPlace2', 'DemoPlace3', 'DemoPlace4', 'DemoPlace5']}
    }, {})
  }
};
