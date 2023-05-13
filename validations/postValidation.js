const Post = require('../models/postModel');
const Category = require('../models/categoryModel');
const { check, body } = require('express-validator');

exports.store = [
      body('title',"title is not valid")
      .notEmpty().withMessage("title is required")
      .isString().withMessage("title must be string")
      .isLength({ min: 3 }).withMessage("title must be 3 length at minimum and 20 at maximum")
      .trim(),
      body('content',"content is not valid")
      .notEmpty().withMessage("content is required")
      .isString().withMessage("content must be string")
      .isLength({ min: 3 }).withMessage("content must be 3 length at minimum and 20 at maximum")
      .trim(),
      body('publish',"publish is not valid")
      .notEmpty().withMessage("publish is required")
      .isNumeric().withMessage("publish must be Numeric Value")
      .isIn([ "0", "1" ]).withMessage("publish must be Value with 0 or 1"),
      body('publishAt',"publishAt is not valid")
      .if(body('publish').equals('0'))
      .notEmpty().withMessage("publishAt is required")
      .isDate().withMessage("publishAt must be Date")
      .custom(value=>{
          let enteredDate=new Date(value);
          let todaysDate=new Date();
          if(enteredDate < todaysDate){
              throw new Error("Invalid Date");
          }
          return true;
      }),
        body('category',"category is not valid")
        .optional()
        .isMongoId().withMessage("category is Not ObjectId")
        .custom((value, { req }) => {
            return Category.findById(value)
                .then(chCat => {
                    if (!chCat) {
                        return Promise.reject(
                            'The category not Valid.'
                        );
                    }
                });
        }),

  ];
exports.show = [
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
];
exports.update = [
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
    body('publish',"publish is not valid")
        .notEmpty().withMessage("publish is required")
        .isNumeric().withMessage("publish must be Numeric Value")
        .isIn([ "0", "1" ]).withMessage("publish must be Value with 0 or 1"),
    body('publishAt',"publishAt is not valid")
        .if(body('publish').equals('0'))
        .notEmpty().withMessage("publishAt is required")
        .isDate().withMessage("publishAt must be Date")
        .custom(value=>{
            let enteredDate=new Date(value);
            let todaysDate=new Date();
            if(enteredDate < todaysDate){
                throw new Error("Invalid Date");
            }
            return true;
        }),
  ];
exports.delete = [
  body('ids',"ids is not valid")
  .notEmpty().withMessage("ids is required")
  .isArray().withMessage('ids must be an array '),
  body('ids.*', 'ids is Not ObjectId').isMongoId()
  .custom((value, { req }) => {
      return Post.findById(value).then(chPost => {
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
];