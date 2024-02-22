'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName: 'Demo',
        lastName: 'Owner',
        email: 'demo1@owner.io',
        username: 'DemoOwner1',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Fake',
        lastName: 'User',
        email: 'fake1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password1')
      },
      {
        firstName: 'Demo',
        lastName: 'Owner',
        email: 'demo12@owner.io',
        username: 'DemoOwner2',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Fake',
        lastName: 'User',
        email: 'fake12@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'Demo',
        lastName: 'Owner',
        email: 'demo3@owner.io',
        username: 'DemoOwner3',
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        firstName: 'Fake',
        lastName: 'User',
        email: 'fake3@user.io',
        username: 'FakeUser3',
        hashedPassword: bcrypt.hashSync('password5')
      },
      {
        firstName: 'Demo',
        lastName: 'Owner',
        email: 'demo4@owner.io',
        username: 'DemoOwner4',
        hashedPassword: bcrypt.hashSync('password6')
      },
      {
        firstName: 'Fake',
        lastName: 'User',
        email: 'fake4@user.io',
        username: 'FakeUser4',
        hashedPassword: bcrypt.hashSync('password7')
      },
      {
        firstName: 'Demo',
        lastName: 'Owner',
        email: 'demo5@owner.io',
        username: 'DemoOwner5',
        hashedPassword: bcrypt.hashSync('password8')
      },
      {
        firstName: 'Fake',
        lastName: 'User',
        email: 'fake5@user.io',
        username: 'FakeUser5',
        hashedPassword: bcrypt.hashSync('password9')
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
