const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { Op } = require('sequelize');
const { environment } = require('../../config');
const isProduction = environment === 'production';

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('The provided email is invalid.'),
  check('username')
    .exists({ checkFalsy: true })
    .withMessage('Username is required')
    .isLength({ min: 4 })
    .withMessage('Username must be at least 4 characters long')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.')
    .custom(async (value, { req }) => {
      const user = await User.findOne({ 
        where: {
          username: value
        } 
      });
      if (user) {
        throw new Error('Username must be unique');
      }
    }),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('First Name is required'),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Last Name is required'),
  handleValidationErrors
];

  router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { email, password, username, firstName, lastName } = req.body;
      const hashedPassword = bcrypt.hashSync(password);

      const checkEmail = await User.findOne({
        where: {
          email
        }
      })

      if (checkEmail) {
        return res.status(500).json({
          "message": "User already exists",
          "errors": {
            "email": "User with that email already exists"
          }
        });
      }

      const checkUsername = await User.findOne({
        where: {
          username
        }
      })

      if (checkUsername) {
        return res.status(500).json({
          "message": "User already exists",
          "errors": {
            "username": "User with that username already exists"
          }
        });
      }

      const user = await User.create({ email, username, hashedPassword, firstName, lastName });

      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
    }
  );

module.exports = router;
