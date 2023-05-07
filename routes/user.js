const express = require('express');
const multer = require('multer');

const userController = require('../controllers/user');
const User = require('../models/user');
const isAuth = require('../middleware/is-auth');

const { check, body } = require('express-validator');
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


//Get all users
router.get('/',isAuth, userController.getUsers);

//st store user
router.post('/store'
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
  ], userController.storeUser);
//nd store user

// st show user
router.get('/show/:userId',isAuth,[
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
],userController.viewUser);
// nd show user

//st update user
router.put('/update'
    ,multer(
    { 
      storage: fileStorage,
     fileFilter: fileFilter 
    }
    ).single('avatar'),
    isAuth,
    [
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
  ], userController.updateUser);
//nd update user

//st delete users
router.delete('/delete',isAuth,
[
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
],
userController.deleteUsers);
//nd delete users





module.exports = router;