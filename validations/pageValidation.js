const Page = require('../models/pageModel');
const { check, body } = require('express-validator');

exports.store =[
      body('title',"title is not valid")
      .notEmpty().withMessage("title is required")
      .isString().withMessage("title must be string")
      .isLength({ min: 3 }).withMessage("title must be 3 length at minimum and 20 at maximum")
      .trim(),
      // body('publish',"publish is not valid")
      // .isNumeric().withMessage("publish must be Numeric Value"),
  ];
exports.show=[
  check('pageId',"id is not valid")
  .notEmpty().withMessage("id is required")
  .isMongoId().withMessage("id is Not ObjectId")
  .custom((value, { req }) => {
      return Page.findById(value).then(chPage => {
        if (!chPage) {
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
        return Page.findById(value ).then(chPage => {
          if (!chPage) {
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
  ];
exports.delete = [
  body('ids',"ids is not valid")
  .notEmpty().withMessage("ids is required")
  .isArray().withMessage('ids must be an array ')
  ,
  body('ids.*', 'ids is Not ObjectId').isMongoId()
  .custom((value, { req }) => {
      return Page.findById(value).then(chPage => {
        if (!chPage) {
          return Promise.reject(
              'id is not valid.'
          );
        }
        
      });
    }),
];
