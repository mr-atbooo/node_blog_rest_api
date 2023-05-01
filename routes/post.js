const express = require('express');
const multer = require('multer');

const postController = require('../controllers/post');
const Post = require('../models/post');

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


//Get /feed/posts
router.get('/', postController.getPosts);

//st store post
router.post('/store'
    ,multer(
    { 
      storage: fileStorage,
     fileFilter: fileFilter 
    }
    ).single('image'),
    [
      body('title',"title is not valid")
      .notEmpty().withMessage("title is required")
      .isString().withMessage("title must be string")
      .isLength({ min: 3 }).withMessage("title must be 3 length at minimum and 20 at maximum")
      .trim(),
      // body('publish',"publish is not valid")
      // .isNumeric().withMessage("publish must be Numeric Value"),

      
      
  ], postController.storePost);
//nd store post

// st show post
router.get('/show/:postId',[
  check('postId',"id is not valid")
  .notEmpty().withMessage("id is required")
  .isMongoId().withMessage("id is Not ObjectId")
  .custom((value, { req }) => {
      return Post.findById(value).then(chPost => {
        if (!chPost) {
          return Promise.reject(
              'id is not valid.'
          );
        }
      });
    }),
],postController.viewPost);
// nd show post

//st update post
router.put('/update'
    ,multer(
    { 
      storage: fileStorage,
     fileFilter: fileFilter 
    }
    ).single('image'),
    [
      body('id',"id is not valid")
    .notEmpty().withMessage("id is required")
    .isMongoId().withMessage("id is Not ObjectId")
    .custom((value, { req }) => {
        return Post.findById(value ).then(postCat => {
          if (!postCat) {
            return Promise.reject(
              'id is not valid.'
            );
          }
        });
      }),
      body('title',"title is not valid")
      .notEmpty().withMessage("title is required")
      .isString().withMessage("title must be string")
      .isLength({ min: 3 }).withMessage("title must be 3 length at minimum and 20 at maximum")
      .trim(),
      // body('publish',"publish is not valid")
      // .isNumeric().withMessage("publish must be Numeric Value"),

      
      
  ], postController.updatePost);
//nd update post

//st delete category
router.delete('/delete',
[
  body('ids',"ids is not valid")
  .notEmpty().withMessage("ids is required")
  .isArray().withMessage('ids must be an array ')
  ,
  body('ids.*', 'ids is Not ObjectId').isMongoId()
  .custom((value, { req }) => {
      return Post.findById(value).then(chPost => {
        if (!chPost) {
          return Promise.reject(
              'id is not valid.'
          );
        }
      });
    }),
],
postController.deletePosts);
//nd delete category





module.exports = router;