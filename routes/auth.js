const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty()
  ],
  authController.signup
);

router.post('/login',
[ 
  body('email')
  .notEmpty().withMessage('Email field is required.')
  .isEmail().withMessage('Please enter a valid email.')
  .normalizeEmail()
  .custom((value, { req }) => {
      return User.findOne({ email: value }).then(userDoc => {
        if (!userDoc) {
          return Promise.reject(
            'Invalid email or password.'
          );
        }
      });
    }),
    body(
      'password',
      'Please enter a password with only numbers and text and at least 5 characters.'
    )
    .notEmpty().withMessage('Email field is required.')
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim(),
  ] 
,authController.login);


module.exports = router;
