const express = require('express');
const multer = require('multer');

const userController = require('../../controllers/api/userController');
const UserValidation = require('../../validations/userValidation');
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


router.get('/',isAuth, userController.getUsers);
router.post('/store'
    ,multer(
    { 
      storage: fileStorage,
     fileFilter: fileFilter 
    }
    ).single('avatar'),
    isAuth,UserValidation.store, userController.storeUser);
router.get('/show/:userId',isAuth,UserValidation.show,userController.viewUser);
router.put('/update'
    ,multer(
    { 
      storage: fileStorage,
     fileFilter: fileFilter 
    }
    ).single('avatar'),
    isAuth,UserValidation.update,userController.updateUser);
router.delete('/delete',isAuth,UserValidation.delete,userController.deleteUsers);

module.exports = router;