const express = require('express');
const multer = require('multer');

const postController = require('../../controllers/api/postController');
const PostRoute = require('../../models/postModel');
const isAuth = require('../../middleware/api/is-auth');

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
    isAuth,
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
      return PostRoute.findById(value).then(chPost => {
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
    isAuth,
    [
      body('id',"id is not valid")
    .notEmpty().withMessage("id is required")
    .isMongoId().withMessage("id is Not ObjectId")
    .custom((value, { req }) => {
        return PostRoute.findById(value ).then(postCat => {
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

//st delete post
router.delete('/delete',isAuth,
[
  body('ids',"ids is not valid")
  .notEmpty().withMessage("ids is required")
  .isArray().withMessage('ids must be an array ')
  ,
  body('ids.*', 'ids is Not ObjectId').isMongoId()
  .custom((value, { req }) => {
      return PostRoute.findById(value).then(chPost => {
        if (!chPost) {
          return Promise.reject(
              'id is not valid.'
          );
        }
        if (chPost.creator) {
          const error = new Error('Not authorized!');
          error.statusCode = 403;
          throw error;

          if (chPost.creator.toString() !== req.userId) {
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
          }
        }
      });
    }),
],
postController.deletePosts);
//nd delete post





module.exports = router;