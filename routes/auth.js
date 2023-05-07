const express = require('express');
const multer = require('multer');
const { body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    var temp_file_arr = file.originalname.split(".");
            var temp_file_name = temp_file_arr[0];
            var temp_file_extension = temp_file_arr[1];
      
    // cb(null, file.originalname);
    cb(null, temp_file_name + '-' + Date.now() + '.' + temp_file_extension);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
    
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};


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

// st profile data
router.get('/profile',isAuth,authController.profile);
// nd profile data

//st update profile
router.put('/profile/update'
    ,multer(
    { 
      storage: fileStorage,
     fileFilter: fileFilter 
    }
    ).single('avatar'),
    isAuth,
    [
      body('name',"name is not valid")
      .notEmpty().withMessage("name is required")
      .isString().withMessage("name must be string")
      .isLength({ min: 3 }).withMessage("name must be 3 length at minimum and 20 at maximum")
      .trim(),
      body('password',"password is not valid")
      .notEmpty().withMessage("password is required")
      .isLength({ min: 6 }).withMessage("password must be 6 length at minimum and 20 at maximum")
      .trim(),
      body('email')
      .notEmpty().withMessage("email is required")
      .isEmail().withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User
        .findOne({ email: value,_id:{ $ne: req.userId }})
        .then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
  ], authController.updateProfile);
//nd update profile



module.exports = router;
