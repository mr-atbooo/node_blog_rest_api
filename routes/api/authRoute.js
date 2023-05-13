const express = require('express');
const multer = require('multer');
const { body } = require('express-validator');

const User = require('../../models/userModel');
const authController = require('../../controllers/api/authController');
const authValidation = require('../../validations/authValidation');
const isAuth = require('../../middleware/api/is-auth');

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


router.put('/signup',authValidation.signup, authController.signup);

router.post('/login',authValidation.login,authController.login);

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
    authValidation.updateProfile, authController.updateProfile);
//nd update profile



module.exports = router;
