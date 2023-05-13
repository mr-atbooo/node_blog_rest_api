const User = require('../models/userModel');

const { check, body } = require('express-validator');

exports.store = [
      body('name',"name is not valid")
      .notEmpty().withMessage("name is required")
      .isString().withMessage("name must be string")
      .isLength({ min: 3 }).withMessage("name must be 3 length at minimum and 20 at maximum")
      .trim(),
      body('password',"password is not valid")
      .notEmpty().withMessage("password is required")
      .isLength({ min: 6 }).withMessage("password must be 6 length at minimum and 20 at maximum")
      .trim(),
        body('role')
        .notEmpty().withMessage("role is required")
        .isString().withMessage("role must be string")
        .isIn(['user','Administrator','Editor','Contributor']), 
        body('email')
        .notEmpty().withMessage("email is required")
        .isEmail().withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
          return User.findOne({ email: value }).then(userDoc => {
            if (userDoc) {
              return Promise.reject('E-Mail address already exists!');
            }
          });
        })
        .normalizeEmail(),
  ];
exports.show = [
  check('userId',"id is not valid")
  .notEmpty().withMessage("id is required")
  .isMongoId().withMessage("id is Not ObjectId")
  .custom((value, { req }) => {
      return User.findById(value).then(chUser => {
        if (!chUser) {
          return Promise.reject(
              'id is not valid.'
          );
        }
      });
    }),
];
exports.update = [
      body('id',"id is not valid")
    .notEmpty().withMessage("id is required")
    .isMongoId().withMessage("id is Not ObjectId")
    .custom((value, { req }) => {
        return User.findById(value ).then(chUser => {
          if (!chUser) {
            return Promise.reject(
              'id is not valid.'
            );
          }
        });
      }),
      body('name',"name is not valid")
      .notEmpty().withMessage("name is required")
      .isString().withMessage("name must be string")
      .isLength({ min: 3 }).withMessage("name must be 3 length at minimum and 20 at maximum")
      .trim(),
      body('password',"password is not valid")
      .notEmpty().withMessage("password is required")
      .isLength({ min: 6 }).withMessage("password must be 6 length at minimum and 20 at maximum")
      .trim(),
        body('role')
        .notEmpty().withMessage("role is required")
        .isString().withMessage("role must be string")
        .isIn(['user','Administrator','Editor','Contributor']), 
        body('email')
        .notEmpty().withMessage("email is required")
        .isEmail().withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
          return User
          .findOne({ email: value,_id:{ $ne: req.body.id }})
          .then(userDoc => {
            if (userDoc) {
              return Promise.reject('E-Mail address already exists!');
            }
          });
        })
        .normalizeEmail(),
  ];
exports.delete = [
  body('ids',"ids is not valid")
  .notEmpty().withMessage("ids is required")
  .isArray().withMessage('ids must be an array '),
  body('ids.*', 'ids is Not ObjectId').isMongoId()
  .custom((value, { req }) => {
      return User.findById(value).then(chUser => {
        if (!chUser) {
          return Promise.reject(
              'id is not valid.'
          );
        }
      });
    }),
];
